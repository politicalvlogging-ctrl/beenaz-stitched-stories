import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Clock, ArrowRight, Mail } from "lucide-react";
import heroBoutique from "../assets/hero-boutique.jpg";
import collectionFormal from "../assets/collection-formal.jpg";
import collectionCasual from "../assets/collection-casual.jpg";
import collectionParty from "../assets/collection-party.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Beenaz Fashion House — Premium Women's Clothing in Lahore" },
      { name: "description", content: "Stitched variety of premium women's clothing, crafted in Lahore. Visit us at SQ 99 Mall & Apartments, Bahria Town, or call 0308 6844441." },
      { property: "og:title", content: "Beenaz Fashion House — Premium Women's Clothing in Lahore" },
      { property: "og:description", content: "Stitched variety of premium women's clothing, crafted in Lahore." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
    ],
  }),
});

const collections = [
  {
    title: "Formal Wear",
    description: "Refined stitched formals for every occasion — elegant silhouettes, delicate embroidery.",
    image: collectionFormal,
    alt: "Elegant lavender formal dress from Beenaz Fashion House",
  },
  {
    title: "Casual Luxe",
    description: "Soft premium lawn and cotton blends for everyday sophistication.",
    image: collectionCasual,
    alt: "Blush pink casual outfit from Beenaz Fashion House",
  },
  {
    title: "Party & Bridal",
    description: "Statement pieces with hand-finished details for celebrations that matter.",
    image: collectionParty,
    alt: "Luxury party wear dress with gold embroidery",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container-tight flex h-16 items-center justify-between">
          <a href="/" className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Beenaz
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#collections" className="hover:text-foreground transition-colors">Collections</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#visit" className="hover:text-foreground transition-colors">Visit Us</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
          <a href="tel:03086844441" className="btn-brand text-sm py-2 px-4">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call Now</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16">
        <div className="relative h-[80vh] min-h-[560px] w-full overflow-hidden">
          <img
            src={heroBoutique}
            alt="Elegant interior of Beenaz Fashion House boutique in Lahore"
            className="h-full w-full object-cover"
            width={1440}
            height={800}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-tight">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-lavender-deep">
                  Crafted in Lahore
                </p>
                <h1 className="font-display text-5xl font-semibold leading-[1.1] text-foreground sm:text-6xl lg:text-7xl">
                  Premium Women's Clothing
                </h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  A stitched variety of premium women's clothing, designed with elegance and made for the modern woman.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#collections" className="btn-brand">
                    Explore Collections
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#visit" className="btn-outline">
                    Visit Our Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="section-padding bg-cream">
        <div className="container-tight">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-lavender-deep">Our Collections</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              Curated for Every Moment
            </h2>
            <p className="mt-4 text-muted-foreground">
              From everyday ease to statement celebrations, discover pieces stitched with care.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <article
                key={collection.title}
                className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={600}
                    height={800}
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    {collection.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-padding bg-background">
        <div className="container-tight">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-lavender-deep">About Beenaz</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
                Lahore's Finest Stitched Fashion
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Beenaz Fashion House brings together traditional craftsmanship and contemporary design. Each piece is carefully stitched to offer premium quality, perfect fit, and timeless style for women who value elegance.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Whether you are looking for a graceful formal outfit, refined casual wear, or a show-stopping party dress, our collections are made to make you feel confident.
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <p className="font-display text-3xl font-semibold text-foreground">Premium</p>
                  <p className="text-sm text-muted-foreground">Quality Fabrics</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold text-foreground">Stitched</p>
                  <p className="text-sm text-muted-foreground">Ready to Wear</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold text-foreground">Lahore</p>
                  <p className="text-sm text-muted-foreground">Local Craft</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-blush/50" />
              <img
                src={collectionParty}
                alt="Elegant party wear collection showcasing Beenaz craftsmanship"
                className="relative rounded-2xl shadow-xl"
                width={600}
                height={800}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section id="visit" className="section-padding bg-blush/30">
        <div className="container-tight">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-lavender-deep">Visit Us</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
                Find Our Boutique
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Step into our store and experience the collection in person. Our team is ready to help you find the perfect outfit.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Store Address</h3>
                    <p className="mt-1 text-muted-foreground">
                      SQ 99 Mall & Apartments, Shop No. 106, First Floor,<br />
                      Bahria Town, Lahore, 54000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Opening Hours</h3>
                    <p className="mt-1 text-muted-foreground">
                      Monday — Sunday: 11:00 AM — 9:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <iframe
                title="Beenaz Fashion House Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3400.0!2d74.3896!3d31.4754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919018f0!2sBahria%20Town%20Lahore!5e0!3m2!1sen!2spk!4v1"
                width="100%"
                height="100%"
                className="min-h-[360px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding bg-background">
        <div className="container-tight">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-lavender-deep">Contact</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-muted-foreground">
              Have a question or want to check availability? Call us directly or send a message.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <a
                href="tel:03086844441"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-lavender/50 hover:bg-blush/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-display text-xl font-semibold text-foreground group-hover:text-lavender-deep transition-colors">
                    0308 6844441
                  </p>
                </div>
              </a>
              <a
                href="tel:03244311936"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-lavender/50 hover:bg-blush/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-display text-xl font-semibold text-foreground group-hover:text-lavender-deep transition-colors">
                    0324 4311936
                  </p>
                </div>
              </a>
            </div>
            <div className="mt-6">
              <a
                href="mailto:beenazfashion@gmail.com"
                className="group inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 transition-colors hover:border-lavender/50 hover:bg-blush/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-display text-xl font-semibold text-foreground group-hover:text-lavender-deep transition-colors">
                    beenazfashion@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container-tight">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-display text-2xl font-semibold text-foreground">Beenaz</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Premium women's clothing — crafted in Lahore.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>SQ 99 Mall & Apartments, Shop 106, First Floor</p>
              <p>Bahria Town, Lahore, 54000</p>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Beenaz Fashion House. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
