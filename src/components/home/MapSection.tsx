import { MapPin } from "lucide-react";

const MapSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Find Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visit our office for personalized consultation
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
            {/* Map Placeholder - MapTiler integration */}
            <div className="relative w-full h-96 bg-gradient-to-br from-navy-lighter to-secondary flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-2">MapTiler Integration</h3>
                <p className="text-muted-foreground mb-4">
                  Add your MapTiler API key to display an interactive map
                </p>
                <div className="inline-block px-4 py-2 bg-card rounded-lg border border-border">
                  <code className="text-sm text-primary font-mono">YOUR_MAPTILER_API_KEY</code>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  123 Education Street, City Center, Your City, 12345
                </p>
              </div>
            </div>

            {/* Contact Info Bar */}
            <div className="bg-primary text-primary-foreground p-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm opacity-90 mb-1">Address</p>
                  <p className="font-semibold">123 Education Street, City Center</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Phone</p>
                  <p className="font-semibold">+1 (234) 567-890</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Email</p>
                  <p className="font-semibold">info@ieltspro.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
