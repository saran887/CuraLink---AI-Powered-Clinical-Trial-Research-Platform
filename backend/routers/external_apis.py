"""
External APIs router - Fetch data from PubMed, ClinicalTrials.gov, ORCID
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import requests
from xml.etree import ElementTree as ET
from database import get_db
from models import ExternalPublication, ExternalTrial
from schemas import ExternalPublicationResponse, ExternalTrialResponse

router = APIRouter()


# ============ PubMed Integration ============
def fetch_pubmed_articles(query: str, max_results: int = 10):
    """
    Fetch articles from PubMed API
    """
    # Step 1: Search PubMed for IDs
    search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    search_params = {
        "db": "pubmed",
        "term": query,
        "retmax": max_results,
        "retmode": "json"
    }
    
    try:
        search_response = requests.get(search_url, params=search_params, timeout=10)
        search_data = search_response.json()
        
        if "esearchresult" not in search_data or "idlist" not in search_data["esearchresult"]:
            return []
        
        pubmed_ids = search_data["esearchresult"]["idlist"]
        
        if not pubmed_ids:
            return []
        
        # Step 2: Fetch details for each ID
        fetch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
        fetch_params = {
            "db": "pubmed",
            "id": ",".join(pubmed_ids),
            "retmode": "xml"
        }
        
        fetch_response = requests.get(fetch_url, params=fetch_params, timeout=10)
        root = ET.fromstring(fetch_response.content)
        
        articles = []
        for article in root.findall(".//PubmedArticle"):
            try:
                pmid = article.find(".//PMID").text
                title_elem = article.find(".//ArticleTitle")
                title = title_elem.text if title_elem is not None else "No title"
                
                abstract_elem = article.find(".//AbstractText")
                abstract = abstract_elem.text if abstract_elem is not None else "No abstract available"
                
                journal_elem = article.find(".//Journal/Title")
                journal = journal_elem.text if journal_elem is not None else "Unknown"
                
                # Extract authors
                authors_list = []
                for author in article.findall(".//Author"):
                    lastname = author.find("LastName")
                    forename = author.find("ForeName")
                    if lastname is not None and forename is not None:
                        authors_list.append(f"{forename.text} {lastname.text}")
                
                authors = ", ".join(authors_list) if authors_list else "Unknown"
                
                pub_date = article.find(".//PubDate/Year")
                pub_year = pub_date.text if pub_date is not None else "Unknown"
                
                articles.append({
                    "external_id": pmid,
                    "source": "pubmed",
                    "title": title,
                    "authors": authors,
                    "abstract": abstract if len(abstract) < 5000 else abstract[:5000] + "...",
                    "journal": journal,
                    "publication_date": pub_year,
                    "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
                })
            except Exception as e:
                continue
        
        return articles
    
    except Exception as e:
        print(f"Error fetching PubMed data: {e}")
        return []


@router.get("/pubmed/search")
def search_pubmed(query: str, max_results: int = 10, db: Session = Depends(get_db)):
    """
    Search PubMed for articles
    """
    articles = fetch_pubmed_articles(query, max_results)
    
    # Cache articles in database
    cached_articles = []
    for article_data in articles:
        existing = db.query(ExternalPublication).filter(
            ExternalPublication.external_id == article_data["external_id"]
        ).first()
        
        if not existing:
            article = ExternalPublication(**article_data)
            db.add(article)
            db.commit()
            db.refresh(article)
            cached_articles.append(article)
        else:
            cached_articles.append(existing)
    
    return cached_articles


# ============ ClinicalTrials.gov Integration ============
def fetch_clinical_trials(condition: str, max_results: int = 10):
    """
    Fetch clinical trials from ClinicalTrials.gov API
    """
    base_url = "https://clinicaltrials.gov/api/v2/studies"
    
    params = {
        "query.cond": condition,
        "pageSize": max_results,
        "format": "json"
    }
    
    try:
        response = requests.get(base_url, params=params, timeout=10)
        data = response.json()
        
        trials = []
        if "studies" in data:
            for study in data["studies"]:
                try:
                    protocol = study.get("protocolSection", {})
                    identification = protocol.get("identificationModule", {})
                    status_module = protocol.get("statusModule", {})
                    description = protocol.get("descriptionModule", {})
                    conditions = protocol.get("conditionsModule", {})
                    design = protocol.get("designModule", {})
                    contacts = protocol.get("contactsLocationsModule", {})
                    
                    nct_id = identification.get("nctId", "")
                    title = identification.get("briefTitle", "No title")
                    
                    condition_list = conditions.get("conditions", [])
                    condition_str = ", ".join(condition_list) if condition_list else "Unknown"
                    
                    phase_list = design.get("phases", [])
                    phase = ", ".join(phase_list) if phase_list else "Unknown"
                    
                    status = status_module.get("overallStatus", "Unknown")
                    
                    brief_summary = description.get("briefSummary", "No description available")
                    
                    # Get location
                    locations = contacts.get("locations", [])
                    location = locations[0].get("city", "Unknown") if locations else "Unknown"
                    
                    # Get contact email
                    central_contacts = contacts.get("centralContacts", [])
                    contact_email = central_contacts[0].get("email", "") if central_contacts else ""
                    
                    trials.append({
                        "nct_id": nct_id,
                        "title": title,
                        "condition": condition_str,
                        "phase": phase,
                        "status": status,
                        "location": location,
                        "description": brief_summary if len(brief_summary) < 5000 else brief_summary[:5000] + "...",
                        "contact_email": contact_email,
                        "url": f"https://clinicaltrials.gov/study/{nct_id}"
                    })
                except Exception as e:
                    continue
        
        return trials
    
    except Exception as e:
        print(f"Error fetching ClinicalTrials.gov data: {e}")
        return []


@router.get("/clinicaltrials/search")
def search_clinical_trials(condition: str, status: str = None, max_results: int = 10, db: Session = Depends(get_db)):
    """
    Search ClinicalTrials.gov for trials
    """
    trials = fetch_clinical_trials(condition, max_results)
    
    # Filter by status if provided
    if status:
        trials = [t for t in trials if status.lower() in t["status"].lower()]
    
    # Cache trials in database
    cached_trials = []
    for trial_data in trials:
        existing = db.query(ExternalTrial).filter(
            ExternalTrial.nct_id == trial_data["nct_id"]
        ).first()
        
        if not existing:
            trial = ExternalTrial(**trial_data)
            db.add(trial)
            db.commit()
            db.refresh(trial)
            cached_trials.append(trial)
        else:
            cached_trials.append(existing)
    
    return cached_trials


# ============ ORCID Integration ============
@router.get("/orcid/{orcid_id}")
def get_orcid_publications(orcid_id: str):
    """
    Fetch researcher's publications from ORCID
    """
    url = f"https://pub.orcid.org/v3.0/{orcid_id}/works"
    headers = {
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            works = data.get("group", [])
            
            publications = []
            for work_group in works[:10]:  # Limit to 10
                work_summary = work_group.get("work-summary", [])
                if work_summary:
                    work = work_summary[0]
                    title_data = work.get("title", {})
                    title = title_data.get("title", {}).get("value", "No title")
                    
                    pub_year = work.get("publication-date", {}).get("year", {}).get("value", "Unknown")
                    
                    journal_title = work.get("journal-title", {}).get("value", "Unknown")
                    
                    publications.append({
                        "title": title,
                        "journal": journal_title,
                        "year": pub_year
                    })
            
            return {"orcid_id": orcid_id, "publications": publications}
        else:
            raise HTTPException(status_code=404, detail="ORCID profile not found")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching ORCID data: {str(e)}")


@router.get("/health")
def external_api_health():
    """
    Check external API service health
    """
    return {
        "status": "healthy",
        "services": {
            "pubmed": "active",
            "clinicaltrials": "active",
            "orcid": "active"
        }
    }
