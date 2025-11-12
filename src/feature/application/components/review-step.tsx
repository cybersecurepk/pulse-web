"use client"

import { ApplicationFormData } from "../data/schema"
import { CONSENT_SECTIONS } from "../data/constants"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { CheckboxField } from "@/components/core/hook-form/checkbox-field"

interface ReviewStepProps {
  data: ApplicationFormData
  form: any
}

export function ReviewStep({ data, form }: ReviewStepProps) {

  return (
    <div className="space-y-6 w-full overflow-hidden">
      {/* Personal Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
              <dd className="mt-1">{data.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="mt-1">{data.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
              <dd className="mt-1 capitalize">{data.gender}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Primary Phone</dt>
              <dd className="mt-1">{data.primaryPhone}</dd>
            </div>
            {data.secondaryPhone && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Secondary Phone</dt>
                <dd className="mt-1">{data.secondaryPhone}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Current City</dt>
              <dd className="mt-1">{data.currentCity}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Permanent City</dt>
              <dd className="mt-1">{data.permanentCity}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Education</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Years of Education</dt>
              <dd className="mt-1">{data.yearsOfEducation}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Highest Degree</dt>
              <dd className="mt-1">{data.highestDegree}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Majors</dt>
              <dd className="mt-1">{data.majors}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">University</dt>
              <dd className="mt-1">{data.university}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Year of Completion</dt>
              <dd className="mt-1">{data.yearOfCompletion}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Experience</h3>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Experience</dt>
              <dd className="mt-1">{data.totalExperience}</dd>
            </div>
            
            {data.experiences && data.experiences.length > 0 && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground mb-2">Experience Details</dt>
                <dd className="space-y-3">
                  {data.experiences.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <p className="font-medium">Experience {index + 1}</p>
                      {exp.organization && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Organization:</span> {exp.organization}
                        </p>
                      )}
                      {exp.designation && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Designation:</span> {exp.designation}
                        </p>
                      )}
                      {exp.from && exp.to && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Duration:</span> {format(exp.from, "MMM yyyy")} - {format(exp.to, "MMM yyyy")}
                        </p>
                      )}
                    </div>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Availability & Interests */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Availability & Interests</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Working Days</dt>
              <dd className="mt-1 capitalize">{data.workingDays}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Weekends</dt>
              <dd className="mt-1 capitalize">{data.weekends}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Onsite Sessions</dt>
              <dd className="mt-1 capitalize">{data.onsiteSessions}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Remote Sessions</dt>
              <dd className="mt-1 capitalize">{data.remoteSessions}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground mb-2">Areas of Interest</dt>
              <dd className="mt-1">
                <ul className="list-disc list-inside space-y-1">
                  {data.blueTeam && <li>Information & Cyber Security - Blue Team</li>}
                  {data.redTeam && <li>Information & Cyber Security - Red Team</li>}
                  {data.grc && <li>Governance, Risk and Compliance</li>}
                  {!data.blueTeam && !data.redTeam && !data.grc && (
                    <li className="text-muted-foreground">No areas selected</li>
                  )}
                </ul>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Consent */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Consent <span className="text-destructive">*</span></h3>
          <div className="border rounded-lg p-4 max-w-200 max-h-60 overflow-y-auto overflow-x-hidden">
            {CONSENT_SECTIONS.map((section, index) => (
              <div key={index} className={section.centered ? "text-center mb-6 break-words" : "mb-6 break-words"}>
                {section.centered ? (
                  <>
                    <h2 className="text-xl font-bold mb-2 break-words">{section.title}</h2>
                    {section.subtitle && (
                      <h3 className="text-lg font-semibold text-primary break-words">{section.subtitle}</h3>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-3 break-words">
                      {section.number && `${section.number}. `}{section.title}
                    </h3>
                    {section.content && (
                      <p className="text-sm leading-relaxed whitespace-pre-line mb-3 break-words">
                        {section.content}
                      </p>
                    )}
                    {section.items && (
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm leading-relaxed break-words">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <CheckboxField
              name="consent"
              options={[
                {
                  id: "consent",
                  label: "I have read and understood the consent notice and agree to the collection, use, and processing of my personal data",
                },
              ]}
              required
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}