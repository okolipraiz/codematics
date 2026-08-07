import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Codematics Tools</h1>
        <ModeToggle />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Email Template Builder</h2>
          <p className="text-muted-foreground mb-4">
            Create beautiful, responsive email templates with our drag-and-drop builder.
            Export to HTML or integrate with popular email service providers.
          </p>
          <Link href="/email-builder">
            <Button>Open Builder</Button>
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Home;
