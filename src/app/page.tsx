import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <section className='grid gap-8 md:grid-cols-2 items-center'>
        <div>
          <h1 className='text-4xl md:text-5xl font-bold leading-tight pacifico-regular'>
            Your AI-powered study partner
          </h1>
          <p className='mt-4 text-lg text-muted-foreground max-w-prose'>
            Upload notes, get concise AI summaries, chat with your materials,
            and review with flashcards & MCQs. Stay focused and study smarter.
          </p>
          <div className='mt-6 flex gap-3'>
            <Button
              size='lg'
              // onClick={() => }
            >
              Get started
            </Button>
          </div>
        </div>
        <div className='relative'>
          <div className='absolute -inset-6 -z-10 rounded-2xl bg-blue-100 blur-2xl' />
          <Card className='shadow-lg'>
            <CardHeader>
              <CardTitle>AI Summary Preview</CardTitle>
              <CardDescription>
                See how StudyMate condenses your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>• Key topic overviews distilled to essentials</p>
                <p>• Definitions highlighted with examples</p>
                <p>• Step-by-step processes summarized clearly</p>
                <p>• Takeaways at a glance for quick revision</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* features */}

      <section id='features' className='mt-16 grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Upload PDFs</CardTitle>
            <CardDescription>Securely add your study notes</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='list-disc pl-4 text-sm text-muted-foreground space-y-1'>
              <li>Fast file processing</li>
              <li>Clean extraction</li>
              <li>Auto-organization</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Summaries</CardTitle>
            <CardDescription>Understand faster</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='list-disc pl-4 text-sm text-muted-foreground space-y-1'>
              <li>Concise overviews</li>
              <li>Key definitions</li>
              <li>Actionable takeaways</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>QnA & Review</CardTitle>
            <CardDescription>Chat and practice</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='list-disc pl-4 text-sm text-muted-foreground space-y-1'>
              <li>Interactive chat</li>
              <li>Flip-card flashcards</li>
              <li>MCQs for recall</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
