export interface FaqItem {
  q: string;
  a: string;
}

export const faqGroups: { category: string; items: FaqItem[] }[] = [
  {
    category: "Buying a Vehicle",
    items: [
      {
        q: "Where can I see the vehicles in person?",
        a: "All available vehicles can be viewed at our yard at Railway Station, along Lumumba Road in Mombasa. You are welcome to walk in during working hours, or message us on WhatsApp first so we can have the vehicle ready.",
      },
      {
        q: "Are the prices on the website negotiable?",
        a: "Listed prices are our asking prices. If you are ready to buy, speak to our team and we will tell you honestly what is possible on that particular vehicle.",
      },
      {
        q: "Can I bring my own mechanic to inspect a car?",
        a: "Yes. We encourage independent inspection. Arrange a time with us and bring whoever you trust to look at the vehicle.",
      },
      {
        q: "Do you help with transfer of ownership?",
        a: "Yes. Our team will guide you through the transfer process and the documents required.",
      },
    ],
  },
  {
    category: "Financing",
    items: [
      {
        q: "Do you offer financing directly?",
        a: "Financing is arranged through lenders, not by us directly. Tell us your budget and deposit and we will point you in the right direction and prepare the vehicle documents a lender will ask for.",
      },
      {
        q: "How accurate is the financing calculator?",
        a: "It is an estimate only. It shows you roughly what a monthly repayment could look like. Actual terms depend on the lender and on your application.",
      },
    ],
  },
  {
    category: "Trade-In",
    items: [
      {
        q: "Can I trade in my current car?",
        a: "Yes. Send us the details of your vehicle through the trade-in form and our team will review them and come back to you with an estimated valuation.",
      },
      {
        q: "What affects my trade-in value?",
        a: "Mainly the model, year, mileage, mechanical condition, body condition and how in-demand the vehicle currently is locally.",
      },
    ],
  },
  {
    category: "Importation",
    items: [
      {
        q: "Can you source a specific vehicle for me?",
        a: "Yes. Tell us the make, model, year, specification and budget and we will look for suitable units and advise you on cost and timelines.",
      },
      {
        q: "How long does importation take?",
        a: "Timelines depend on sourcing, shipping schedules and clearance. We will give you a realistic estimate for your specific request rather than a general promise.",
      },
    ],
  },
  {
    category: "Documentation",
    items: [
      {
        q: "What documents do I need to buy a vehicle?",
        a: "Typically a national ID or passport, your KRA PIN and payment details. We will confirm exactly what is required for your purchase.",
      },
      {
        q: "Will I get a logbook in my name?",
        a: "Yes. Transfer of ownership is part of the purchase process and our team will take you through it.",
      },
    ],
  },
  {
    category: "Warranty",
    items: [
      {
        q: "Do vehicles come with a warranty?",
        a: "Warranty coverage varies by vehicle. Contact our team for the specific warranty terms applicable to your vehicle.",
      },
    ],
  },
  {
    category: "Test Drives",
    items: [
      {
        q: "Can I test drive before buying?",
        a: "Yes. Book a test drive through the website or on WhatsApp and we will arrange a time.",
      },
      {
        q: "What should I bring for a test drive?",
        a: "A valid driving licence and your ID.",
      },
    ],
  },
];
