import { Card } from "@/components/ui/card";
import { BookOpen, Globe, Users, Award } from "lucide-react";

const expertiseItems = [
  {
    icon: BookOpen,
    title: "IELTS Preparation",
    description: "Comprehensive training covering all four modules: Listening, Reading, Writing, and Speaking with expert instructors."
  },
  {
    icon: Globe,
    title: "Visa Guidance",
    description: "End-to-end visa application support with documentation assistance and interview preparation."
  },
  {
    icon: Users,
    title: "Student Counseling",
    description: "Personalized guidance for course selection, university shortlisting, and career planning."
  },
  {
    icon: Award,
    title: "Study Abroad",
    description: "Complete support for studying in UK, USA, Canada, Australia, and other top destinations."
  }
];

const ExpertiseSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Expertise</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive services to guide you through every step of your international education journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertiseItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-border bg-card group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
