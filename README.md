# AutoMindAi – Decentralized Vehicle Intelligence Network

## One-Line Description

AutoMindAi is an AI-powered decentralized vehicle intelligence network that creates tamper-proof vehicle identities, service histories, and lifecycle insights using 0G Chain, Storage, and Compute.

---

## Project Summary

AutoMindAi addresses the lack of transparency and trust in vehicle ownership and maintenance records.

Today, vehicle data is fragmented across dealerships, service centers, insurers, and vehicle owners. Service records can be lost or manipulated, making resale verification difficult and creating trust issues for buyers and financial institutions.

AutoMindAi creates a decentralized ecosystem where every vehicle receives a verifiable digital identity. Vehicle ownership, service records, diagnostics, and lifecycle information are secured using 0G infrastructure.

The platform enables:

* Vehicle NFT minting by authorized dealers
* Immutable service history management
* Decentralized vehicle record storage
* AI-powered maintenance predictions
* Vehicle health scoring
* Resale verification and trust scoring
* Vehicle intelligence assistant (AutoMindAi)

By combining blockchain, decentralized storage, and AI, AutoMindAi establishes a trusted source of truth for vehicle lifecycle management.

---

## Problem Statement

Vehicle records are currently:

* Scattered across multiple stakeholders
* Difficult to verify during resale
* Vulnerable to manipulation and fraud
* Not interoperable between organizations
* Lacking intelligent predictive insights

This creates inefficiencies for:

* Vehicle owners
* Buyers
* Dealers
* Service centers
* Insurance providers
* Fleet operators

---

## Why AutoMindAi?

The global automotive ecosystem lacks a universal and trusted vehicle identity layer.

AutoMindAi introduces a decentralized framework where vehicle data becomes:

* Verifiable
* Transparent
* Immutable
* AI-enhanced
* Accessible across stakeholders

The result is greater trust, lower fraud, improved maintenance planning, and stronger resale markets.

---

## 0G Integration Plan

### 0G Chain

**Purpose:**

* Vehicle NFT ownership management
* Dealer verification
* Service center registration
* On-chain metadata references
* Vehicle ownership transfers

**Data Stored:**

* Vehicle NFT references
* Ownership events
* Service record hashes
* Verification proofs

---

### 0G Storage

**Purpose:**

* Vehicle metadata storage
* Service records
* Diagnostic reports
* Maintenance history
* Vehicle documents

**Benefits:**

* Decentralized storage
* Tamper resistance
* High scalability
* Long-term persistence

---

### 0G Compute

**Purpose:**

* Predictive maintenance analysis
* Vehicle health scoring
* Resale value estimation
* AI-powered diagnostics
* Intelligent vehicle assistant

**Benefits:**

* Decentralized AI inference
* Scalable compute resources
* Verifiable AI outputs

---

### Future Agentic ID Integration

Every vehicle will evolve into an intelligent vehicle agent capable of:

* Monitoring vehicle health
* Recommending maintenance schedules
* Generating resale intelligence
* Supporting insurance assessments

This will leverage 0G's Agentic ID standard to create intelligent, transferable vehicle identities.

---

## Technical Architecture

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| **Presentation** | React, Vite, Tailwind CSS, Redux | Dashboard UI, wallet connection, role-based views |
| **Application** | Node.js, Express.js | Auth, API gateway, 0G SDK orchestration |
| **Blockchain** | 0G Chain (EVM), Solidity ERC-721 | Vehicle NFT minting, ownership, on-chain record hashes |
| **Decentralized Storage** | 0G Storage | Vehicle metadata, service records, diagnostic JSON |
| **Decentralized AI** | 0G Compute (DeepSeek R1) | Vehicle assistant, resale estimation, diagnostics |
| **Off-Chain Index** | MongoDB | User accounts, service hash indexing, session data |

---

### Smart Contract — `SimpleVehicleNFT`

Deployed on **0G Chain** as an ERC-721 token (`VPASS` — Vehicle Passport).

| Function | Description |
|----------|-------------|
| `mint(to, tokenURI, metadataHash)` | Dealer mints a vehicle NFT to buyer's wallet |
| `addServiceRecord(tokenId, json)` | Appends a service record hash/JSON reference on-chain |
| `tokenURI(tokenId)` | Returns IPFS/0G metadata URI for the vehicle |
| `getServiceRecordCount(tokenId)` | Returns total service records linked to a vehicle |
| `getServiceRecordAt(tokenId, index)` | Fetches a specific service record by index |

**On-Chain Data:** Token ownership, token URI, metadata hash, service record references  
**Off-Chain Data (0G Storage):** Full vehicle JSON, service details, images, diagnostic reports

---

### User Roles & Access

```mermaid
flowchart LR
    subgraph Roles
        R1[🧑 Vehicle Owner]
        R2[🏢 Dealer]
        R3[🔧 Service Center]
    end

    R1 --> A1[View Vehicles]
    R1 --> A2[Transfer NFT]
    R1 --> A3[Service History]
    R1 --> A4[Resale Estimator]
    R1 --> A5[AutoMindAi Chat]

    R2 --> B1[Mint Vehicle NFT]
    R2 --> B2[Upload Metadata]

    R3 --> C1[Add Service Record]
    R3 --> C2[Upload to 0G Storage]
```

---

### Core Data Flows

#### 1. Vehicle NFT Minting (Dealer → Owner)

```mermaid
sequenceDiagram
    participant D as Dealer
    participant FE as Frontend
    participant BE as Backend
    participant IPFS as IPFS (Pinata)
    participant ZGS as 0G Storage
    participant SC as Smart Contract
    participant O as Owner Wallet

    D->>FE: Fill vehicle details + upload image
    FE->>BE: POST /api/uploadFile (vehicle image)
    BE->>ZGS: Upload file buffer
    ZGS-->>BE: rootHash + txHash
    FE->>BE: POST /api/IPFS (NFT metadata JSON)
    BE->>IPFS: Pin metadata JSON
    IPFS-->>BE: ipfs://hash (tokenURI)
    FE->>BE: POST /api/uploadJSON (full vehicle data)
    BE->>ZGS: Upload vehicle JSON
    ZGS-->>BE: metadataHash
    FE->>SC: mint(ownerAddress, tokenURI, metadataHash)
    SC->>O: Vehicle NFT transferred to owner wallet
    SC-->>FE: tokenId confirmed
```

#### 2. Service Record Addition (Service Center)

```mermaid
sequenceDiagram
    participant SC as Service Center
    participant FE as Frontend
    participant BE as Backend
    participant ZGS as 0G Storage
    participant MDB as MongoDB
    participant CH as 0G Chain

    SC->>FE: Submit service details (vehicle tokenId)
    FE->>BE: POST /api/uploadJSON (service record)
    BE->>ZGS: Store service JSON
    ZGS-->>BE: rootHash
    FE->>BE: POST /addService (tokenId + rootHash)
    BE->>MDB: Index service hash by tokenId
    FE->>CH: addServiceRecord(tokenId, rootHash)
    CH-->>FE: ServiceRecordAdded event emitted
```

#### 3. AI Vehicle Assistant — AutoMindAi (0G Compute)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend Chatbot
    participant BE as Backend
    participant ZGS as 0G Storage
    participant ZGC as 0G Compute (DeepSeek R1)

    U->>FE: Enter Token ID + ask question
    FE->>BE: POST /addService/display (get service hashes)
    BE->>MDB: Fetch indexed hashes for tokenId
    FE->>BE: GET /api/fetchJSON/:rootHash
    BE->>ZGS: Retrieve service record JSON
    ZGS-->>BE: Service record data
    FE->>BE: POST /api/ask0GCompute (tokenId, query, serviceRecord)
    BE->>ZGC: Discover AI provider + generate auth headers
    ZGC-->>BE: AI response (verified via TEE)
    BE-->>FE: reply + verified flag
    FE-->>U: AutoMindAi assistant response
```

#### 4. Vehicle Ownership Transfer

```mermaid
sequenceDiagram
    participant O1 as Current Owner
    participant FE as Frontend
    participant SC as Smart Contract
    participant O2 as New Owner

    O1->>FE: Select vehicle + enter recipient wallet
    FE->>SC: safeTransferFrom(owner, recipient, tokenId)
    SC->>O2: NFT ownership updated on-chain
    Note over SC: Full service history travels with NFT
    SC-->>FE: Transfer confirmed
```

---




## Development Roadmap

### Wave 1 – Project Scoping & Architecture

* Finalize system architecture
* Design smart contract structure
* Define 0G integrations
* Create technical documentation
* Develop UI/UX wireframes

### Wave 2 – Testnet Prototype

* Vehicle NFT minting
* 0G Storage integration
* Dealer onboarding workflow
* Basic dashboard deployment

### Wave 3 – Mainnet Deployment

* Deploy smart contracts on 0G Mainnet
* Complete ownership workflows
* Service record verification system

### Wave 4 – AI Intelligence Layer

* Predictive maintenance engine
* Vehicle health scoring
* Resale intelligence module

### Wave 5 – Growth & Agentic Vehicles

* Agentic ID integration
* AI vehicle assistant
* Early user onboarding
* Partnership expansion

---
