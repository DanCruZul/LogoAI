"use client";

export default function HeroSection() {
  return (
    <section className="text-center mb-12 lg:mb-24">
      <div
        className="mb-6 mx-auto w-fit border rounded-full border-primary px-3 py-1 text-sm
          text-primary"
      >
        <a
          href="https://danielink.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Daniel Cruz
        </a>
      </div>
      <h1
        className="text-5xl md:text-7xl font-bold mb-2 md:mb-6 bg-gradient text-transparent
          !bg-clip-text pb-2"
      >
        Create Beautiful
        <br />
        Logos with AI
      </h1>
      <p className="text-lg max-w-xl text-muted-foreground mb-6 md:mb-8 mx-auto">
        Create stunning logos in real-time with your team. AI-powered logo
        generation has never been this fun and easy.
      </p>
      {/* <Button size="lg" className="w-fit md:w-auto rounded-full">
        <Github className="mr-2 h-5 w-5" /> Continue with Github
      </Button> */}
    </section>
  );
}
