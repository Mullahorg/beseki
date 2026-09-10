
-- Services
insert into public.services (slug,title,summary,detail,points,position,status) values
('vehicle-inspection','Vehicle Inspection','A careful look at the vehicle before money changes hands.','We walk through the vehicle with you — bodywork, engine, underside, interior and documents — so you know exactly what you are buying. You are also welcome to bring your own mechanic.',array['Body and paint check','Engine and drivetrain','Documents and logbook','Independent inspection welcome'],1,'published'),
('vehicle-sourcing','Vehicle Sourcing','Looking for something we don''t have on the yard? Tell us.','If the vehicle you want is not in our current stock, share the make, model, year and budget. We will look for a suitable unit and come back to you with what we find.',array['Specific make and model requests','Budget-led search','Honest feedback on availability'],2,'published'),
('importation-assistance','Importation Assistance','Guidance through sourcing, shipping, clearance and registration.','Importing takes longer than buying from stock but gives you exactly the specification you want. We help you understand the steps, the timelines and the costs involved before you commit.',array['Sourcing and confirmation','Shipping and arrival','Clearance guidance','Registration support'],3,'published'),
('maintenance','Maintenance','Keeping the car right after you drive it away.','Talk to us about routine servicing and repairs. We will advise you on what a vehicle needs and when, particularly for the coastal conditions here in Mombasa.',array['Service advice','Repair coordination','Coastal-condition guidance'],4,'published'),
('after-sales-support','After-Sales Support','A number you can call after the sale.','Questions do not stop at handover. Whether it is paperwork, a warning light or a service question, our team is reachable on phone and WhatsApp.',array['Transfer of ownership help','Ongoing WhatsApp support','Warranty enquiries'],5,'published')
on conflict (slug) do nothing;

-- FAQs
insert into public.faqs (question,answer,category,position,status) values
('Where can I see the vehicles in person?','All available vehicles can be viewed at our yard at Railway Station, along Lumumba Road in Mombasa. You are welcome to walk in during working hours, or message us on WhatsApp first so we can have the vehicle ready.','Buying a Vehicle',1,'published'),
('Are the prices on the website negotiable?','Listed prices are our asking prices. If you are ready to buy, speak to our team and we will tell you honestly what is possible on that particular vehicle.','Buying a Vehicle',2,'published'),
('Can I bring my own mechanic to inspect a car?','Yes. We encourage independent inspection. Arrange a time with us and bring whoever you trust to look at the vehicle.','Buying a Vehicle',3,'published'),
('Do you help with transfer of ownership?','Yes. Our team will guide you through the transfer process and the documents required.','Buying a Vehicle',4,'published'),
('Do you offer financing directly?','Financing is arranged through lenders, not by us directly. Tell us your budget and deposit and we will point you in the right direction and prepare the vehicle documents a lender will ask for.','Financing',5,'published'),
('How accurate is the financing calculator?','It is an estimate only. It shows you roughly what a monthly repayment could look like. Actual terms depend on the lender and on your application.','Financing',6,'published'),
('Can I trade in my current car?','Yes. Send us the details of your vehicle through the trade-in form and our team will review them and come back to you with an estimated valuation.','Trade-In',7,'published'),
('What affects my trade-in value?','Mainly the model, year, mileage, mechanical condition, body condition and how in-demand the vehicle currently is locally.','Trade-In',8,'published'),
('Can you source a specific vehicle for me?','Yes. Tell us the make, model, year, specification and budget and we will look for suitable units and advise you on cost and timelines.','Importation',9,'published'),
('How long does importation take?','Timelines depend on sourcing, shipping schedules and clearance. We will give you a realistic estimate for your specific request rather than a general promise.','Importation',10,'published'),
('What documents do I need to buy a vehicle?','Typically a national ID or passport, your KRA PIN and payment details. We will confirm exactly what is required for your purchase.','Documentation',11,'published'),
('Will I get a logbook in my name?','Yes. Transfer of ownership is part of the purchase process and our team will take you through it.','Documentation',12,'published'),
('Do vehicles come with a warranty?','Warranty coverage varies by vehicle. Contact our team for the specific warranty terms applicable to your vehicle.','Warranty',13,'published'),
('Can I test drive before buying?','Yes. Book a test drive through the website or on WhatsApp and we will arrange a time.','Test Drives',14,'published'),
('What should I bring for a test drive?','A valid driving licence and your ID.','Test Drives',15,'published');

-- Team (placeholders, clearly marked)
insert into public.team_members (name,position_title,bio,phone,email,position,status) values
('Name to be confirmed','Sales','This profile is a placeholder. Add the team member''s name, role and a short introduction here.','0721 886656','benkise26@gmail.com',1,'published'),
('Name to be confirmed','Vehicle Sourcing & Importation','This profile is a placeholder. Add the team member''s name, role and a short introduction here.','0721 886656','benkise26@gmail.com',2,'published'),
('Name to be confirmed','After-Sales Support','This profile is a placeholder. Add the team member''s name, role and a short introduction here.','0721 886656','benkise26@gmail.com',3,'published');

-- Blog
insert into public.blog_posts (slug,title,excerpt,body,category,status,published_at) values
('what-to-check-before-buying-a-locally-used-car','What to check before buying a locally used car','A short, practical checklist you can use on the forecourt — from logbook details to the things worth listening for on a test drive.','Buying a used car is mostly about removing surprises. Before you talk about price, spend twenty minutes on the vehicle itself and the paperwork behind it.

Start with the logbook. The chassis number on the document should match the number on the car, and the registered owner should be the person you are dealing with or a dealer with clear authority to sell.

Then look at the car cold. Start the engine from cold if you can — most faults are loudest in the first minute. Listen for knocking, watch the exhaust for smoke, and check that the temperature gauge settles where it should.

On the test drive, find a quiet stretch and let go of the steering wheel briefly at a steady speed. The car should track straight. Brake firmly once. There should be no pulling, shuddering or long pedal travel.

Finally, ask for a service history and an independent inspection. A seller who is confident in the car will not object to either.','Car Buying Tips','published','2026-06-18'),
('petrol-diesel-or-hybrid-for-kenyan-roads','Petrol, diesel or hybrid: what makes sense on Kenyan roads','Fuel type affects running costs more than most buyers expect. Here is how the three options compare for typical Kenyan use.','The right fuel type depends far less on the badge than on how you actually drive.

Petrol engines remain the simplest and cheapest to repair. For city driving and moderate distances they are usually the sensible default, especially in smaller cars.

Diesel comes into its own with weight and distance. If you regularly carry loads, tow, or drive long upcountry routes, the torque and fuel economy justify the higher service costs.

Hybrids are excellent in stop-start traffic, which describes much of Mombasa and Nairobi. The main consideration is battery condition on older imports — ask for a battery health report.','Vehicle Guides','published','2026-05-30'),
('keeping-your-car-healthy-in-coastal-humidity','Keeping your car healthy in coastal humidity','Salt air and humidity are hard on vehicles. A few simple habits make a real difference to how a car ages in Mombasa.','Coastal air carries salt, and salt accelerates corrosion. Cars that live near the ocean age differently from cars in the highlands.

Wash the underbody regularly, not just the paintwork. Most rust starts underneath, out of sight.

Keep the air conditioning in good order. Damp cabins encourage mould in the vents and can leave a persistent smell that is expensive to remove later.

Check door and boot seals once or twice a year. Perished rubber lets in moisture, and moisture in the carpet is the beginning of a much bigger repair.','Maintenance','published','2026-05-12'),
('understanding-vehicle-financing-in-kenya','Understanding vehicle financing in Kenya','Deposits, loan periods and interest rates explained in plain language, so you can compare offers with confidence.','Vehicle financing is easier to compare once you separate the three numbers that matter: the deposit, the repayment period and the interest rate.

The deposit reduces the amount you borrow. A larger deposit lowers both the monthly instalment and the total interest you pay over the term.

The repayment period spreads the cost. Longer terms look cheaper each month but cost more overall.

The interest rate is set by the lender based on your profile and the vehicle. Always ask what the total repayable amount is, not just the monthly figure.

Our financing calculator gives you an estimate so you can start the conversation with realistic numbers. Actual terms always come from the lender.','Financing','published','2026-04-27'),
('importing-a-vehicle-what-to-expect','Importing a vehicle: what to expect','From sourcing and shipping to clearance and registration, an overview of how an imported vehicle reaches your hands.','Importing can be a good way to get exactly the specification you want, but it takes longer than buying from stock.

The process begins with sourcing: agreeing on the make, model, year, grade and budget, then identifying a suitable unit at auction or from a supplier.

Shipping and arrival at the port follow. Timelines vary with sailing schedules.

Clearance involves duty assessment and inspection. Age limits and duty calculations change from time to time, so confirm current requirements before committing.

Registration completes the process, after which the vehicle is road legal and ready for handover.','Importation','published','2026-04-05'),
('the-mombasa-used-car-market-a-buyers-view','The Mombasa used car market: a buyer''s view','What buyers at the coast tend to look for, and how that shapes the vehicles that hold their value locally.','Coastal buyers weigh things differently from buyers upcountry. Air conditioning is not optional, and corrosion history matters more.

Compact automatics do well in town, while double cabs and larger SUVs remain steady sellers for business and upcountry travel.

Vehicles with clear service records and honest mileage consistently sell faster, whatever the badge on the bonnet.','Mombasa Automotive Market','published','2026-03-19')
on conflict (slug) do nothing;

-- Homepage sections
insert into public.page_sections (page_slug,section_key,variant,heading,subheading,body,settings,position,enabled) values
('home','hero','default','The right car starts with a straight answer.','New and locally used motor vehicles, carefully selected and available to view at our showroom along Lumumba Road, Mombasa.','', '{"eyebrow":"BESEKI COMPANY LIMITED · MOMBASA","highlight":"straight answer.","primary_label":"Browse Inventory","primary_href":"/inventory","secondary_label":"Book a Test Drive","secondary_href":"/contact","show_whatsapp":true}'::jsonb,1,true),
('home','search','default','What are you looking for?','','','{"eyebrow":"Search stock","link_label":"Advanced search"}'::jsonb,2,true),
('home','featured','default','Cars worth coming to see.','Browse our latest vehicles online, then come to the yard, inspect the car properly and ask every question you need to.','','{"eyebrow":"Current stock","limit":6,"cta_label":"View all vehicles"}'::jsonb,3,true),
('home','trust','default','','','','{"items":[{"icon":"BadgeCheck","title":"Quality focused","copy":"We inspect vehicles before putting them forward."},{"icon":"HandCoins","title":"Clear pricing","copy":"We discuss the vehicle and its price openly."},{"icon":"MapPin","title":"Visit the yard","copy":"See the actual car along Lumumba Road."},{"icon":"Wrench","title":"After the sale","copy":"Our team remains reachable after handover."}]}'::jsonb,4,true),
('home','why','default','Buying a car should feel straightforward.','We are a Mombasa dealership, not a call centre. You deal with real people, see the actual vehicle and get space to make a decision properly.','','{"eyebrow":"Why BESEKI","items":[{"number":"01","title":"See the car properly","copy":"Photos help you shortlist. Seeing the vehicle in person helps you decide."},{"number":"02","title":"Ask uncomfortable questions","copy":"Condition, mileage, history, paperwork or previous repairs — ask before you buy."},{"number":"03","title":"Take your time","copy":"We would rather help you choose the right car than push you into the wrong one."},{"number":"04","title":"Stay connected","copy":"The same BESEKI team remains available for questions after the sale."}]}'::jsonb,5,true),
('home','body_types','default','Start with the shape you need.','','','{"eyebrow":"Browse by type"}'::jsonb,6,true),
('home','finance_tradein','default','Make the monthly figure work for you.','Start with an indicative calculation, then talk to our team about available financing options.','','{"eyebrow":"Financing","second_eyebrow":"Trade-in","second_heading":"Your current car could be part of the deal.","second_subheading":"Tell us about your current vehicle and we will review the details and come back with an indicative estimate."}'::jsonb,7,true),
('home','latest','default','Recently added to the yard.','New stock changes quickly. These are some of the most recently added vehicles in the current inventory.','','{"eyebrow":"Latest arrivals","limit":3}'::jsonb,8,true),
('home','services','default','More than simply handing over the keys.','From financing conversations to after-sales support, our goal is to make the ownership journey easier.','','{"eyebrow":"Beyond the sale","limit":6}'::jsonb,9,true),
('home','testimonials','default','What buyers say.','Customer reviews should be published only after they have been verified.','','{"eyebrow":"Customer stories","limit":3}'::jsonb,10,true),
('home','blog','default','Useful reading before you buy.','','','{"eyebrow":"From BESEKI","limit":3}'::jsonb,11,true),
('home','showroom','default','Come see the cars for yourself.','Come during working hours or message us first so we can have the vehicle ready.','','{"eyebrow":"Visit BESEKI","points":["View the vehicle in person","Ask questions before making a decision"]}'::jsonb,12,true),
('home','final_cta','default','Found a car you like?','Ask a question, book a viewing or speak to the BESEKI team directly.','','{"eyebrow":"Ready when you are","cta_label":"Contact BESEKI","cta_href":"/contact"}'::jsonb,13,true);

-- Sample stock so the public site and workflows can be tested
insert into public.vehicles (slug,make,model,year,price,mileage,transmission,fuel,engine,body_type,drive_type,condition,color,description,features,image_keys,featured,availability,published,is_demo) values
('toyota-alphard-2019','Toyota','Alphard',2019,5450000,62000,'Automatic','Petrol','2.5L 4-cylinder','MPV','2WD','Foreign Used','Pearl White','A well-kept Alphard with full leather interior, powered sliding doors and second-row captain seats. Ideal for family or executive transport.',array['Leather seats','Powered sliding doors','Reverse camera','Alloy wheels','Climate control'],array['alphard-1.jpg','alphard-2.jpg'],true,'Available',true,true),
('toyota-land-cruiser-prado-2018','Toyota','Land Cruiser Prado',2018,7850000,88000,'Automatic','Diesel','2.8L turbo diesel','SUV','4WD','Foreign Used','Silver','A capable Prado suited to both town and upcountry driving. Diesel torque, full-time four-wheel drive and a strong service record.',array['4WD','Leather seats','Sunroof','Cruise control','Reverse camera'],array['prado-1.jpg','prado-2.jpg'],true,'Available',true,true),
('mazda-cx5-2017','Mazda','CX-5',2017,2950000,74000,'Automatic','Petrol','2.0L SkyActiv','SUV','2WD','Locally Used','Deep Red','Economical, comfortable and easy to run. A sensible compact SUV for daily use around Mombasa.',array['Push start','Reverse camera','Alloy wheels','Bluetooth audio'],array['cx5-1.jpg','cx5-2.jpg'],true,'Available',true,true),
('nissan-note-2018','Nissan','Note',2018,1250000,58000,'Automatic','Petrol','1.2L','Hatchback','2WD','Locally Used','Silver','A fuel-efficient hatchback that is easy to park and cheap to maintain. A practical first car or town runabout.',array['Fuel efficient','Reverse camera','Power windows'],array['note-1.jpg','note-2.jpg'],false,'Available',true,true),
('toyota-hilux-2019','Toyota','Hilux Double Cab',2019,4650000,96000,'Manual','Diesel','2.4L turbo diesel','Pickup','4WD','Foreign Used','White','A hardworking double cab with four-wheel drive, ready for both business use and long upcountry trips.',array['4WD','Tow bar','Bed liner','Air conditioning'],array['hilux-1.jpg','hilux-2.jpg'],false,'Available',true,true),
('toyota-premio-2016','Toyota','Premio',2016,1850000,102000,'Automatic','Petrol','1.8L','Sedan','2WD','Locally Used','Pearl White','A comfortable, reliable sedan that remains one of the easiest cars to own and resell locally.',array['Alloy wheels','Fabric interior','Reverse camera','Climate control'],array['sedan-1.jpg','sedan-2.jpg'],false,'Available',true,true)
on conflict (slug) do nothing;
