"use client";

import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import SOWUploader from "@/components/SOWUploader";
import SOWReportDisplay from "@/components/SOWReportDisplay";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2 } from "lucide-react"; // Added import for Loader2

// Define the structure for the report data (matching SOWReportDisplay's props)
interface AnalysisItem {
  status: "Adequate" | "Inadequate";
  notes: string;
  recommendations: string[];
}

interface DetailedAnalysisCategory {
  [key: string]: AnalysisItem;
}

interface SOWReportData {
  sowOverview: {
    objective: string;
    scope: string;
    keyDeliverables: string;
  };
  detailedAnalysis: {
    clarityAndSpecificity: DetailedAnalysisCategory;
    timelineAndMilestones: DetailedAnalysisCategory;
    rolesResponsibilitiesResources: DetailedAnalysisCategory;
    performanceAndQuality: DetailedAnalysisCategory;
    commercialConsiderations: DetailedAnalysisCategory;
    risksAndMitigation: DetailedAnalysisCategory;
  };
  consolidatedRecommendations: string[];
  overallReadinessAssessment: string;
}

// Mock report data for demonstration purposes
const mockReport: SOWReportData = {
  sowOverview: {
    objective: "To develop and deploy a new customer relationship management (CRM) system to streamline sales processes and improve customer engagement.",
    scope: "Design, development, testing, and deployment of a cloud-based CRM system, including data migration from legacy systems and user training.",
    keyDeliverables: "Functional CRM system, user manuals, training materials, data migration report, post-implementation support plan."
  },
  detailedAnalysis: {
    clarityAndSpecificity: {
      objectivePurpose: {
        status: "Adequate",
        notes: "The overall objective is clearly stated.",
        recommendations: []
      },
      scopeOfWork: {
        status: "Inadequate",
        notes: "While inclusions are mentioned, specific exclusions are not clearly defined, leading to potential scope creep.",
        recommendations: ["Question: Can we explicitly list what is NOT included in the scope (e.g., integration with specific third-party tools not mentioned)?", "Recommendation: Add a dedicated 'Exclusions' section to the SOW."]
      },
      deliverables: {
        status: "Inadequate",
        notes: "Deliverables are identified, but specific quality standards and acceptance criteria are vague for 'Functional CRM system' and 'user manuals'.",
        recommendations: ["Question: What are the specific performance benchmarks for the CRM system to be considered 'functional'?", "Recommendation: Define measurable acceptance criteria for each deliverable, including format, content, and quality standards."]
      },
      requirements: {
        status: "Inadequate",
        notes: "Technical and performance requirements are mentioned generally but lack measurable details. Security and compliance requirements are not explicitly articulated.",
        recommendations: ["Question: What are the specific uptime, response time, and data processing requirements?", "Recommendation: Detail all functional, non-functional (performance, security, compliance) requirements with measurable metrics and testable conditions."]
      },
      assumptionsConstraints: {
        status: "Adequate",
        notes: "Some assumptions regarding client data availability are stated.",
        recommendations: []
      }
    },
    timelineAndMilestones: {
      schedule: {
        status: "Adequate",
        notes: "A general timeline with start and end dates is provided.",
        recommendations: []
      },
      milestones: {
        status: "Inadequate",
        notes: "Key project milestones are identified, but specific dates or clear events for completion are missing for some.",
        recommendations: ["Question: Can we assign specific dates or clear completion events to all identified milestones?", "Recommendation: Ensure each milestone has a clear definition of 'done' and an associated target date."]
      },
      dependencies: {
        status: "Adequate",
        notes: "Critical dependencies on client data provision are outlined.",
        recommendations: []
      }
    },
    rolesResponsibilitiesResources: {
      clientResponsibilities: {
        status: "Adequate",
        notes: "Client responsibilities for data provision and review are defined.",
        recommendations: []
      },
      supplierResponsibilities: {
        status: "Adequate",
        notes: "Supplier responsibilities for development and deployment are clearly articulated.",
        recommendations: []
      },
      reportingStructure: {
        status: "Adequate",
        notes: "The reporting structure is clear, indicating weekly progress meetings.",
        recommendations: []
      },
      keyPersonnel: {
        status: "Inadequate",
        notes: "No specific personnel qualifications or experience requirements for the supplier's team are mentioned.",
        recommendations: ["Question: Are there any mandatory certifications or minimum experience levels required for the supplier's key personnel (e.g., project manager, lead developer)?", "Recommendation: Specify desired qualifications for key roles to ensure expertise."]
      }
    },
    performanceAndQuality: {
      performanceMetrics: {
        status: "Inadequate",
        notes: "Performance measures or KPIs for the CRM system are not defined.",
        recommendations: ["Question: What are the key performance indicators (KPIs) for the CRM system's success (e.g., user adoption rate, sales conversion improvement)?", "Recommendation: Define measurable KPIs and SLAs for the operational CRM system."]
      },
      qualityAssurance: {
        status: "Adequate",
        notes: "A general statement about adhering to industry best practices for QA is included.",
        recommendations: []
      }
    },
    commercialConsiderations: {
      pricingStructureSuitability: {
        status: "Adequate",
        notes: "The SOW's structure allows for various pricing models (e.g., fixed-price per phase).",
        recommendations: []
      },
      paymentScheduleLinkage: {
        status: "Adequate",
        notes: "The SOW suggests a payment schedule tied to major milestones.",
        recommendations: []
      },
      changeManagement: {
        status: "Adequate",
        notes: "The SOW implicitly suggests a need for a change control process for scope modifications.",
        recommendations: []
      }
    },
    risksAndMitigation: {
      identifiedRisks: {
        status: "Inadequate",
        notes: "Potential risks like unclear scope and aggressive timelines are present but not explicitly identified or addressed in the SOW.",
        recommendations: ["Risk: Scope creep due to undefined exclusions. Mitigation: Implement a formal change control process and clearly define exclusions.", "Risk: Delays due to vague acceptance criteria. Mitigation: Establish clear, measurable acceptance criteria for all deliverables."]
      },
      mitigationSuggestions: {
        status: "Adequate",
        notes: "Some general mitigation strategies are implied.",
        recommendations: []
      }
    }
  },
  consolidatedRecommendations: [
    "Clarify and explicitly define all scope exclusions to prevent scope creep.",
    "Establish clear, measurable acceptance criteria for all deliverables, including quality standards.",
    "Detail all functional and non-functional requirements with measurable metrics and testable conditions.",
    "Assign specific dates or clear completion events to all project milestones.",
    "Specify desired qualifications and experience levels for key supplier personnel.",
    "Define measurable Key Performance Indicators (KPIs) and Service Level Agreements (SLAs) for the CRM system's performance."
  ],
  overallReadinessAssessment: "Significant revisions required. The SOW has a good foundation but lacks critical detail in scope, requirements, and acceptance criteria, posing high risks for competitive bidding and project success."
};


const Index = () => {
  const [report, setReport] = useState<SOWReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeSOW = async (file: File) => {
    setIsLoading(true);
    setReport(null); // Clear previous report

    // --- Placeholder for actual AI backend API call ---
    // In a real application, you would send the 'file' to your AI backend here.
    // Example using fetch:
    // const formData = new FormData();
    // formData.append('sowFile', file);
    // try {
    //   const response = await fetch('/api/analyze-sow', {
    //     method: 'POST',
    //     body: formData,
    //   });
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   const result: SOWReportData = await response.json();
    //   setReport(result);
    //   showSuccess("SOW analyzed successfully!");
    // } catch (error) {
    //   console.error("Error analyzing SOW:", error);
    //   showError("Failed to analyze SOW. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
    // --- End Placeholder ---

    // Simulate API call delay and then set mock report
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setReport(mockReport);
    showSuccess("SOW analyzed successfully!");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">AI SOW Analyzer</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Ensure your Statement of Work is clear, complete, and ready for competitive bidding.
        </p>
      </div>

      <SOWUploader onFileUpload={analyzeSOW} isLoading={isLoading} />

      {isLoading && (
        <div className="mt-8 flex items-center text-lg text-gray-700 dark:text-gray-300">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing your SOW... This may take a moment.
        </div>
      )}

      {report && <SOWReportDisplay report={report} />}

      <MadeWithDyad />
    </div>
  );
};

export default Index;