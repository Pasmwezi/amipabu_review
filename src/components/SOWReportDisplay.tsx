"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define the structure for the report data
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

interface SOWReportDisplayProps {
  report: SOWReportData;
}

const SOWReportDisplay: React.FC<SOWReportDisplayProps> = ({ report }) => {
  const renderAnalysisSection = (title: string, category: DetailedAnalysisCategory) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {Object.entries(category).map(([key, item]) => (
        <div key={key} className="mb-4 p-3 border rounded-md bg-muted/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
            <Badge variant={item.status === "Adequate" ? "default" : "destructive"}>
              {item.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{item.notes}</p>
          {item.recommendations.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Recommendations/Questions:</p>
              <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
                {item.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">SOW Analysis Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* I. SOW Overview and Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-4">I. SOW Overview and Summary</h2>
          <div className="space-y-2 text-muted-foreground">
            <p><span className="font-semibold text-foreground">Objective:</span> {report.sowOverview.objective}</p>
            <p><span className="font-semibold text-foreground">Scope:</span> {report.sowOverview.scope}</p>
            <p><span className="font-semibold text-foreground">Key Deliverables:</span> {report.sowOverview.keyDeliverables}</p>
          </div>
        </div>

        <Separator />

        {/* II. Detailed Analysis Against Key Criteria */}
        <div>
          <h2 className="text-2xl font-bold mb-4">II. Detailed Analysis Against Key Criteria</h2>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="clarity-specificity">
              <AccordionTrigger className="text-lg font-semibold">Clarity and Specificity</AccordionTrigger>
              <AccordionContent>
                {renderAnalysisSection("Clarity and Specificity", report.detailedAnalysis.clarityAndSpecificity)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="timeline-milestones">
              <AccordionTrigger className="text-lg font-semibold">Timeline and Milestones</AccordionTrigger>
              <AccordionContent>
                {renderAnalysisSection("Timeline and Milestones", report.detailedAnalysis.timelineAndMilestones)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="roles-responsibilities">
              <AccordionTrigger className="text-lg font-semibold">Roles, Responsibilities, and Resources</AccordionTrigger>
              <AccordionContent>
                {renderAnalysisSection("Roles, Responsibilities, and Resources", report.detailedAnalysis.rolesResponsibilitiesResources)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="performance-quality">
              <AccordionTrigger className="text-lg font-semibold">Performance and Quality</AccordionTrigger>
              <AccordionContent>
                {renderAnalysisSection("Performance and Quality", report.detailedAnalysis.performanceAndQuality)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="commercial-considerations">
              <AccordionTrigger className="text-lg font-semibold">Commercial Considerations</AccordionTrigger>
              <AccordionContent>
                {renderAnalysisSection("Commercial Considerations", report.detailedAnalysis.commercialConsiderations)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="risks-mitigation">
              <AccordionTrigger className="text-lg font-semibold">Risks and Mitigation</AccordionTrigger>
              <AccordionContent>
                {renderAnalysisSection("Risks and Mitigation", report.detailedAnalysis.risksAndMitigation)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Separator />

        {/* III. Consolidated Recommendations and Questions for the Client */}
        <div>
          <h2 className="text-2xl font-bold mb-4">III. Consolidated Recommendations and Questions for the Client</h2>
          {report.consolidatedRecommendations.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {report.consolidatedRecommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No consolidated recommendations or questions at this time.</p>
          )}
        </div>

        <Separator />

        {/* IV. Overall Readiness Assessment */}
        <div>
          <h2 className="text-2xl font-bold mb-4">IV. Overall Readiness Assessment</h2>
          <p className="text-lg font-medium text-primary">{report.overallReadinessAssessment}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SOWReportDisplay;