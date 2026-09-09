/** DEMO CONTENT — editorial articles written as placeholders. Replace with real posts. */

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  body: string[];
}

export const blogCategories = [
  "Car Buying Tips",
  "Maintenance",
  "Vehicle Guides",
  "Mombasa Automotive Market",
  "Financing",
  "Importation",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "what-to-check-before-buying-a-locally-used-car",
    title: "What to check before buying a locally used car",
    category: "Car Buying Tips",
    excerpt:
      "A short, practical checklist you can use on the forecourt — from logbook details to the things worth listening for on a test drive.",
    date: "2026-06-18",
    readMinutes: 5,
    body: [
      "Buying a used car is mostly about removing surprises. Before you talk about price, spend twenty minutes on the vehicle itself and the paperwork behind it.",
      "Start with the logbook. The chassis number on the document should match the number on the car, and the registered owner should be the person you are dealing with or a dealer with clear authority to sell.",
      "Then look at the car cold. Start the engine from cold if you can — most faults are loudest in the first minute. Listen for knocking, watch the exhaust for smoke, and check that the temperature gauge settles where it should.",
      "On the test drive, find a quiet stretch and let go of the steering wheel briefly at a steady speed. The car should track straight. Brake firmly once. There should be no pulling, shuddering or long pedal travel.",
      "Finally, ask for a service history and an independent inspection. A seller who is confident in the car will not object to either.",
    ],
  },
  {
    slug: "petrol-diesel-or-hybrid-for-kenyan-roads",
    title: "Petrol, diesel or hybrid: what makes sense on Kenyan roads",
    category: "Vehicle Guides",
    excerpt:
      "Fuel type affects running costs more than most buyers expect. Here is how the three options compare for typical Kenyan use.",
    date: "2026-05-30",
    readMinutes: 6,
    body: [
      "The right fuel type depends far less on the badge than on how you actually drive.",
      "Petrol engines remain the simplest and cheapest to repair. For city driving and moderate distances they are usually the sensible default, especially in smaller cars.",
      "Diesel comes into its own with weight and distance. If you regularly carry loads, tow, or drive long upcountry routes, the torque and fuel economy justify the higher service costs.",
      "Hybrids are excellent in stop-start traffic, which describes much of Mombasa and Nairobi. The main consideration is battery condition on older imports — ask for a battery health report.",
    ],
  },
  {
    slug: "keeping-your-car-healthy-in-coastal-humidity",
    title: "Keeping your car healthy in coastal humidity",
    category: "Maintenance",
    excerpt:
      "Salt air and humidity are hard on vehicles. A few simple habits make a real difference to how a car ages in Mombasa.",
    date: "2026-05-12",
    readMinutes: 4,
    body: [
      "Coastal air carries salt, and salt accelerates corrosion. Cars that live near the ocean age differently from cars in the highlands.",
      "Wash the underbody regularly, not just the paintwork. Most rust starts underneath, out of sight.",
      "Keep the air conditioning in good order. Damp cabins encourage mould in the vents and can leave a persistent smell that is expensive to remove later.",
      "Check door and boot seals once or twice a year. Perished rubber lets in moisture, and moisture in the carpet is the beginning of a much bigger repair.",
    ],
  },
  {
    slug: "understanding-vehicle-financing-in-kenya",
    title: "Understanding vehicle financing in Kenya",
    category: "Financing",
    excerpt:
      "Deposits, loan periods and interest rates explained in plain language, so you can compare offers with confidence.",
    date: "2026-04-27",
    readMinutes: 5,
    body: [
      "Vehicle financing is easier to compare once you separate the three numbers that matter: the deposit, the repayment period and the interest rate.",
      "The deposit reduces the amount you borrow. A larger deposit lowers both the monthly instalment and the total interest you pay over the term.",
      "The repayment period spreads the cost. Longer terms look cheaper each month but cost more overall.",
      "The interest rate is set by the lender based on your profile and the vehicle. Always ask what the total repayable amount is, not just the monthly figure.",
      "Our financing calculator gives you an estimate so you can start the conversation with realistic numbers. Actual terms always come from the lender.",
    ],
  },
  {
    slug: "importing-a-vehicle-what-to-expect",
    title: "Importing a vehicle: what to expect",
    category: "Importation",
    excerpt:
      "From sourcing and shipping to clearance and registration, an overview of how an imported vehicle reaches your hands.",
    date: "2026-04-05",
    readMinutes: 7,
    body: [
      "Importing can be a good way to get exactly the specification you want, but it takes longer than buying from stock.",
      "The process begins with sourcing: agreeing on the make, model, year, grade and budget, then identifying a suitable unit at auction or from a supplier.",
      "Shipping and arrival at the port follow. Timelines vary with sailing schedules.",
      "Clearance involves duty assessment and inspection. Age limits and duty calculations change from time to time, so confirm current requirements before committing.",
      "Registration completes the process, after which the vehicle is road legal and ready for handover.",
    ],
  },
  {
    slug: "the-mombasa-used-car-market-a-buyers-view",
    title: "The Mombasa used car market: a buyer's view",
    category: "Mombasa Automotive Market",
    excerpt:
      "What buyers at the coast tend to look for, and how that shapes the vehicles that hold their value locally.",
    date: "2026-03-19",
    readMinutes: 4,
    body: [
      "Coastal buyers weigh things differently from buyers upcountry. Air conditioning is not optional, and corrosion history matters more.",
      "Compact automatics do well in town, while double cabs and larger SUVs remain steady sellers for business and upcountry travel.",
      "Vehicles with clear service records and honest mileage consistently sell faster, whatever the badge on the bonnet.",
    ],
  },
];

export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
