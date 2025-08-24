"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

function getScoreStyle(score) {
  if (score >= 80) return { text: "text-green-500", border: "border-green-500", bg: "bg-green-500" }
  if (score >= 50) return { text: "text-yellow-500", border: "border-yellow-500", bg: "bg-yellow-500" }
  return { text: "text-red-500", border: "border-red-500", bg: "bg-red-500" }
}

export default function ResumeAnalysis({ data }) {
  if (!data) {
    return (
      <Card className="p-6 bg-background border border-border">
        <p className="text-muted-foreground">
          No resume data found.
        </p>
      </Card>
    )
  }

  // dynamic style for overall score
  const overallColor = getScoreStyle(data.overallScore)
  const atsColor = getScoreStyle(data.atsScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-6xl font-bold gradient-title">
        AI Analysis Results
      </h2>

      {/* Overall Score */}
      <Card className={`border ${overallColor.border} bg-card/80 backdrop-blur-sm hover:scale-[1.01] transition-transform duration-300`}>
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <i className="fas fa-star text-yellow-500 mr-2"></i> Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-6xl font-extrabold ${overallColor.text}`}>
              {data.overallScore}
              <span className="text-2xl text-foreground">/100</span>
            </span>
          </div>
          <Progress value={data.overallScore} className="h-3 mb-4" />
          <p className="text-muted-foreground text-sm">{data.overallFeedback}</p>
        </CardContent>
      </Card>

      {/* Summary Comment */}
      <Card className="border border-border bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <i className="fas fa-comment-dots text-blue-400 mr-2"></i> Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-base">{data.summaryComment}</p>
        </CardContent>
      </Card>

      {/* Section Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Contact Info" icon="fa-user-circle" score={data.contactScore} comment="Perfectly structured and complete." />
        <SectionCard title="Experience" icon="fa-briefcase" score={data.experienceScore} comment="Strong bullet points and impact." />
        <SectionCard title="Education" icon="fa-graduation-cap" score={data.educationScore} comment="Consider adding relevant coursework." />
        <SectionCard title="Skills" icon="fa-lightbulb" score={data.skillsScore} comment="Expand on specific skill proficiencies." />
      </div>

      {/* ATS Analysis */}
      <Card className={`border ${atsColor.border} bg-card/80`}>
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <i className="fas fa-robot text-purple-500 mr-2"></i> ATS Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-4xl font-bold ${atsColor.text}`}>{data.atsScore}%</span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">{data.atsComment}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Keyword Matches</h4>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                {data.keywordMatches?.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Keyword Gaps</h4>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                {data.keywordGaps?.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Improvement */}
      <Card className="border border-border bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-foreground">
            <i className="fas fa-lightbulb text-orange-400 mr-2"></i> Tips for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-none space-y-4">
            {data.tipsForImprovement?.map((tip, i) => (
              <li key={i} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-bold mr-3">
                  <i className="fas fa-check"></i>
                </span>
                <p className="text-foreground">{tip}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* What's Good & Needs Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-green-500 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <i className="fas fa-hand-thumbs-up text-green-500 mr-2"></i> What's Good
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
              {data.whatsGood?.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-500 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <i className="fas fa-hand-thumbs-down text-red-500 mr-2"></i> Needs Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
              {data.needsImprovement?.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Section Card Component with dynamic color
function SectionCard({ title, icon, score, comment }) {
  const { text, border, bg } = getScoreStyle(score)

  return (
    <Card className={`relative overflow-hidden group border ${border} bg-card/80`}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-foreground">
          <i className={`fas ${icon} text-muted-foreground mr-2`}></i> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className={`text-4xl font-bold ${text}`}>{score}%</span>
        <p className="text-sm text-muted-foreground mt-2">{comment}</p>
        <div
          className={`absolute inset-x-0 bottom-0 h-1 ${bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        ></div>
      </CardContent>
    </Card>
  )
}
