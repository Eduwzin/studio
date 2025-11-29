import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { educationalContent, placeholderImages } from "@/lib/content";
import Image from "next/image";

export default function LearnPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Universidade do Investimento</h1>
      <p className="text-muted-foreground mb-8">
        Sua jornada para a alfabetização financeira começa aqui. Explore nossas trilhas educacionais para construir uma base sólida em investimentos.
      </p>

      <Accordion type="single" collapsible className="w-full">
        {educationalContent.map((topic) => {
          const image = placeholderImages.find(p => p.id === topic.imageId);
          return (
             <AccordionItem value={topic.id} key={topic.id}>
                <AccordionTrigger className="text-lg font-semibold">{topic.title}</AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                    <div className="grid md:grid-cols-3 gap-6 items-start">
                        {image && (
                            <div className="relative aspect-video rounded-md overflow-hidden">
                                <Image 
                                    src={image.imageUrl} 
                                    alt={image.description} 
                                    fill
                                    className="object-cover"
                                    data-ai-hint={image.imageHint}
                                />
                            </div>
                        )}
                        <p className="md:col-span-2">{topic.content}</p>
                    </div>
                </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
