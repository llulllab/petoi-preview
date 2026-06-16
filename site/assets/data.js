/* Petoi site — mock data layer (functional prototype).
   Embedded content layer for the static site. */
window.PETOI = (function () {
  // ---- Navigation (inventory §A): 6 menus + dropdowns ----
  const NAV = [
    { label: "Products", children: [
      { label: "Bittle X Robot Dog (with Robotic Gripper)", href: "product.html?handle=petoi-robot-dog-bittle-x-voice-controlled" },
      { label: "Nybble Q Robot Cat", href: "product.html?handle=petoi-nybble-q-robot-cat" },
      { label: "Robot Pet Comparison", href: "page.html?slug=compare" },
      { label: "Bittle Robot Dog (Final Stock)", href: "product.html?handle=petoi-bittle-robot-dog" },
      { label: "Software & Apps", href: "page.html?slug=software-apps" },
      { label: "Showcases", href: "page.html?slug=showcases" },
      { label: "Customers Love Petoi Robots", href: "page.html?slug=customer-love" },
      { label: "Robot Pet Gallery", href: "page.html?slug=gallery" },
    ]},
    { label: "Shop", children: [
      { label: "Online Store", href: "shop.html" },
      { label: "FAQ", href: "page.html?slug=faq" },
      { label: "Retailers", href: "page.html?slug=retailers" },
    ]},
    { label: "Education", children: [
      { label: "Bittle X for Robotics Education", href: "page.html?slug=education" },
      { label: "Purchase Guide & FAQ for Educators", href: "page.html?slug=educator-guide" },
      { label: "Robotics Curricula (Block / 4-Session / Python / C++)", href: "page.html?slug=curricula" },
      { label: "Research & Academic Applications", href: "page.html?slug=research" },
      { label: "Showcases", href: "page.html?slug=edu-showcases" },
      { label: "Resources", href: "page.html?slug=resources" },
    ]},
    { label: "Technology", children: [
      { label: "OpenCat Open Source Framework", href: "page.html?slug=opencat" },
      { label: "Programmable Robot System Overview", href: "page.html?slug=system-overview" },
      { label: "3D-Print Robot Dog & Cat on OpenCat", href: "page.html?slug=3d-print" },
    ]},
    { label: "Support", children: [
      { label: "Shipping, 30-Day Returns & Warranty", href: "page.html?slug=shipping-returns" },
      { label: "FAQ", href: "page.html?slug=faq" },
      { label: "User Manuals", href: "page.html?slug=manuals" },
      { label: "Community (r/Petoi)", href: "https://www.reddit.com/r/Petoi/" },
      { label: "Forum Archive", href: "page.html?slug=forum" },
      { label: "Robot Dog Comparison", href: "page.html?slug=compare" },
      { label: "Contact Us", href: "contact.html" },
    ]},
    { label: "About us", children: [
      { label: "Petoi", href: "page.html?slug=about" },
      { label: "Blog", href: "blog.html" },
      { label: "News", href: "page.html?slug=news" },
      { label: "Contact Us", href: "contact.html" },
    ]},
  ];

  // ---- Catalog (inventory §C): 18 SKUs ----
  // price = lowest (display "from"); variants carry their own price (cart uses variant price).
  const P = (handle, title, price, category, stock, reviews, opts) => ({
    handle, title, price, category, stock, reviews,
    variants: opts || null,            // [{label, price}] or null
    image: "assets/placeholder.svg",
    blurb: title + " is open-source, programmable Petoi hardware.",
  });
  const V = (label, price) => ({ label, price });
  const PRODUCTS = [
    P("petoi-robot-dog-bittle-x-voice-controlled", "Robo Dog Bittle X", 299, "Robots", "in_stock", 81, [
      V("Bittle X V2 - construction - lite servos", 299),
      V("Bittle X V2 - pre-assembled - lite servos", 339),
      V("Bittle X V2 - construction - alloy servos", 369),
      V("Bittle X V2 - pre-assembled - alloy servos", 419),
      V("Bittle X V2+Arm - construction - alloy servos", 439),
      V("Bittle X V2+Arm - pre-assembled - alloy servos", 489),
      V("Bittle X - pre-assembled - lite servos", 329),
    ]),
    P("petoi-bittle-robot-dog", "Robot Dog Bittle (Final Stock)", 230.99, "Robots", "sold_out", 81),
    P("petoi-sensor-pack", "Robotic Sensors Pack", 44, "Modules", "in_stock", 4),
    P("intelligent-camera-module", "Intelligent Camera Module", 59, "Modules", "discontinued", 3),
    P("petoi-nybble-robot-cat", "Robot Cat Nybble", 299, "Robots", "sold_out", 29),
    P("li-ion-battery-for-petoi-robot-pets", "Li-ion Battery for Petoi Robots", 51, "Power", "sold_out", 3),
    P("petoi-voice-command-module", "Voice Recognition Module", 25, "Modules", "discontinued", 3),
    P("petoi-ai-vision-module-for-arduino", "AI Vision Camera Module", 39, "Modules", "in_stock", 0),
    P("bluetooth-wifi-dongles-for-wireless-connectivity-for-bittle-nybble", "Bluetooth & Wifi Dongle Combo", 20, "Modules", "discontinued", 1),
    P("nyboard-customized-arduino-board", "NyBoard V1", 55, "Boards", "discontinued", 0),
    P("stand-for-bittle-robot-dog-family", "Calibration Stand", 10, "Accessories", "in_stock", 0),
    P("petoi-nybble-q-robot-cat", "Robotic Cat Nybble Q", 435, "Robots", "in_stock", 29, [
      V("Nybble Q - construction - lite servos", 435),
      V("Nybble Q - pre-assembled - lite servos", 485),
      V("Nybble Q - construction - alloy servos", 505),
      V("Nybble Q - pre-assembled - alloy servos", 555),
    ]),
    P("quadruped-robot-dog-bittle-servo-set", "Alloy Robot Servos Set", 119.99, "Accessories", "in_stock", 0),
    P("petoi-robot-controller-microbit-gamepad", "Micro:bit Coding Controller", 52, "Accessories", "in_stock", 0),
    P("biboard-esp32-development-board-for-quadruped-robot", "ESP32 Development Board (BiBoard)", 60, "Boards", "in_stock", 1),
    P("bittle-arm-extension-with-metal-servos", "Bittle Robotic Arm Gripper", 69, "Accessories", "in_stock", 0),
  ];

  // ---- Rich content for flagship products (pulled Step 3c) ----
  const ENRICH = {
    "petoi-robot-dog-bittle-x-voice-controlled": {
      description: "The Bittle X is a DIY ESP32-based quadruped robot dog that assembles in about 60 minutes with all included parts. It is both an interactive companion and an educational coding platform, built on the open-source OpenCat framework.",
      highlights: [
        "Assemble in about 60 minutes with all parts included",
        "Program with block-based coding, Python, and C++",
        "Optional robotic arm gripper for object manipulation",
        "For ages 10+, K-12, colleges, and robotics camps, with free curricula",
        "AI and IoT ready with optional camera and sensor add-ons",
        "About 1 hour of playtime with 35+ lifelike movements",
        "35+ voice commands, plus up to 10 custom commands",
        "Open-source customization through OpenCat",
        "Encourages social-emotional development through collaborative play",
      ],
      specs: { "Degrees of freedom": "9 (2 per leg + 1 neck)", "Processor": "ESP32", "Speed": "40 mm/s standard; 3-4 body lengths/s experimental", "Battery": "Li-ion, ~1 hour continuous", "Payload": "~1 lb", "Connectivity": "Local voice processing; no network required", "Waterproof": "No" },
      faq: [
        ["How long does assembly take?", "About 60 minutes with all included parts. Pre-assembled options are available."],
        ["What's the battery life?", "Roughly 1 hour of continuous operation on the Li-ion pack."],
        ["Which programming languages are supported?", "Block-based coding, Python, and C++ via the Arduino IDE."],
        ["What are the specs (DOF, speed)?", "9 degrees of freedom; 40 mm/s standard, up to 3-4 body lengths/s experimental."],
        ["Are 3D files available?", "Yes, STL files are provided so you can print and customize parts."],
      ],
    },
    "petoi-nybble-q-robot-cat": {
      description: "The Nybble Q is a programmable, open-source robotic cat with a 3D-printed body that blends playful interaction with hands-on coding. Built for ages 10+, it suits both hobbyists and classrooms.",
      highlights: [
        "35+ lifelike movements via mobile app or voice, ~1 hour playtime",
        "Program with block-based coding, Python, and C++",
        "35+ voice commands, plus up to 10 custom commands",
        "Free coding curricula included",
        "Built-in ultrasonic sensor for object detection",
        "Four touch sensors for responsive play",
      ],
      specs: { "Degrees of freedom": "11 (2 per leg, 2 head, 1 tail)", "Processor": "ESP32 / BiBoard V1", "Body": "3D-printed", "Servos": "Lite or alloy (with feedback)", "Battery": "Li-ion, ~1 hour continuous", "Assembly": "Pre-assembled", "Platform": "OpenCat open-source framework" },
      faq: [
        ["How long does assembly take?", "Nybble Q ships pre-assembled; self-assembly kits are not currently offered."],
        ["What's the battery life?", "About 1 hour of continuous operation."],
        ["Which programming languages are supported?", "Block-based coding, Python, and C++."],
        ["What sensors are included?", "An ultrasonic sensor for object detection and four touch sensors for interaction."],
        ["Are 3D files available?", "Yes, the body is 3D-printed and STL files support customization."],
      ],
    },
    "petoi-bittle-robot-dog": {
      description: "Bittle is an open-source, Arduino-based quadruped robot for education and hobbyists. Assemble it in under 90 minutes, then program custom behaviors in block-based coding, Python, or C++, with 35+ lifelike movements and optional AI/IoT upgrades.",
      specs: { "Assembly": "40-90 minutes (construction kit)", "Degrees of freedom": "9 (2 per leg + neck)", "Battery": "~1 hour continuous", "Programming": "Block-based, Python, C++", "Age": "10+", "Payload": "~1 lb" } },
    "petoi-nybble-robot-cat": {
      description: "Nybble is a DIY Arduino-based robot cat you assemble in 3-4 hours, then control and program via mobile app. It has an 11 DOF design with interactive LEDs and an ultrasonic sensor, and supports block-based coding, C++, and Python.",
      specs: { "Assembly": "3-4 hours", "Degrees of freedom": "11 (2 per leg, 2 head, 1 tail)", "Battery": "~70 min (V2 Li-ion)", "Programming": "Block-based, C++, Python", "Control": "App, IR remote, or code", "Age": "14+" } },
    "petoi-sensor-pack": {
      description: "A pack of five modular robotic sensors compatible with Arduino and Raspberry Pi, for IoT and AI projects. Easy to integrate for robotics education and hobbyist builds.",
      specs: { "Contents": "5 sensor modules", "Compatibility": "Arduino, Raspberry Pi, IoT" } },
    "intelligent-camera-module": {
      description: "A camera module that added visual recognition to Arduino-based robotics and Petoi robot pets, with basic object identification and human tracking. Discontinued.",
      specs: { "Compatibility": "Arduino, Bittle, Nybble", "Features": "Object detection, human tracking", "Status": "Discontinued" } },
    "li-ion-battery-for-petoi-robot-pets": {
      description: "A rechargeable lithium-ion battery for Petoi robot pets including Bittle X and Nybble Q, providing about 70 minutes of playtime per charge.",
      specs: { "Type": "Li-ion rechargeable", "Compatibility": "Petoi robot dogs and cats", "Play time": "~70 minutes per charge" } },
    "petoi-voice-command-module": {
      description: "A voice command module that adds hands-free voice control to Petoi robot pets like Bittle and Nybble, integrating with Arduino-compatible systems. Discontinued.",
      specs: { "Compatibility": "Arduino, Bittle, Nybble", "Function": "Voice control", "Status": "Discontinued" } },
    "petoi-ai-vision-module-for-arduino": {
      description: "An affordable AI vision module for Arduino and Petoi robots (Bittle X, Bittle X+Arm) that enables real-time object detection and tracking, letting a quadruped identify and follow objects.",
      specs: { "Compatibility": "Arduino, Bittle X, Bittle X+Arm", "Capability": "Object detection and tracking" } },
    "bluetooth-wifi-dongles-for-wireless-connectivity-for-bittle-nybble": {
      description: "A spare Bluetooth and WiFi dongle combo for wireless control and programming of Bittle and Nybble robot kits. Discontinued.",
      specs: { "Connectivity": "Bluetooth and WiFi", "Compatibility": "Bittle and Nybble", "Status": "Discontinued" } },
    "nyboard-customized-arduino-board": {
      description: "NyBoard V1 is a customized Arduino-based microcontroller board with enhanced peripherals for quadruped robot control and development. Discontinued.",
      specs: { "Type": "Customized Arduino board", "Use": "Quadruped robot control", "Status": "Discontinued" } },
    "stand-for-bittle-robot-dog-family": {
      description: "A simple assembly stand that holds Bittle robot dogs steady during calibration and maintenance, keeping the robot fixed for safe servo adjustment and testing.",
      specs: { "Use": "Calibration and maintenance stand", "Compatibility": "Bittle and Bittle X" } },
    "quadruped-robot-dog-bittle-servo-set": {
      description: "A high-performance alloy servo replacement set for Petoi quadruped robots, available with or without feedback control, for durability upgrades and repairs.",
      specs: { "Quantity": "10 servos per set", "Compatibility": "Bittle, Bittle X, Nybble Q", "Material": "Alloy", "Options": "With or without feedback" } },
    "petoi-robot-controller-microbit-gamepad": {
      description: "A micro:bit-based controller that enables block-based coding control of Petoi robot pets, letting users program movement, gestures, and behaviors without text-based coding.",
      specs: { "Compatibility": "Bittle X, Bittle X+Arm, Nybble Q", "Coding": "Block-based via micro:bit" } },
    "biboard-esp32-development-board-for-quadruped-robot": {
      description: "BiBoard is a high-performance ESP32-based microcontroller board for quadruped robot development and control, with connectivity and sensor integration options.",
      specs: { "Processor": "ESP32", "Use": "Quadruped robot control", "Variants": "V1, V0 + Extension Hat, V0", "Voice": "V1 includes voice module" } },
    "bittle-arm-extension-with-metal-servos": {
      description: "An extension kit that adds a robotic arm and gripper to Bittle robot dogs, with alloy servos for durability, enabling the robot to grasp and manipulate objects.",
      specs: { "Adds": "Robotic arm + gripper", "Servos": "Alloy", "Compatibility": "Bittle X and original Bittle", "Packages": "Standalone or upgrade combos" } },
  };
  PRODUCTS.forEach(p => { if (ENRICH[p.handle]) Object.assign(p, ENRICH[p.handle]); });

  // ---- Real product images (URLs from petoi.com Shopify CDN) ----
  const IMAGES = {
    "petoi-robot-dog-bittle-x-voice-controlled": "https://www.petoi.com/cdn/shop/files/BittleBlackYellowcleanbg_533x.jpg?v=1764746859",
    "petoi-bittle-robot-dog": "https://www.petoi.com/cdn/shop/files/black_yellow_light_blue_bittle_stands_with_text_533x.png?v=1775845824",
    "petoi-sensor-pack": "https://www.petoi.com/cdn/shop/files/petoi_sensor_pack_-_5_modules_4x3_52513dc9-959f-4f7a-a560-66a49ee8ef92_533x.jpg?v=1775845761",
    "intelligent-camera-module": "https://www.petoi.com/cdn/shop/files/1_e10adb8f-442c-4b5e-a6ba-82f70952b327_533x.png?v=1775845894",
    "petoi-nybble-robot-cat": "https://www.petoi.com/cdn/shop/files/1-petoiopensourcearduinonybblerobotcat_465ed315-c595-4d3a-8860-08de17142cf6_533x.jpg?v=1775845780",
    "li-ion-battery-for-petoi-robot-pets": "https://www.petoi.com/cdn/shop/files/06_1946x_f75b9751-ed68-45ae-9ba1-ca640496c593_533x.webp?v=1775845899",
    "petoi-voice-command-module": "https://www.petoi.com/cdn/shop/files/petoivoicecommandmodule23vs2_533x.webp?v=1775846284",
    "petoi-ai-vision-module-for-arduino": "https://www.petoi.com/cdn/shop/files/grove-vision-ai-v2_533x.jpg?v=1775846208",
    "petoi-nybble-q-robot-cat": "https://www.petoi.com/cdn/shop/files/nybble_q_robot_cat_knees_down_and_says_hi_-_4x3_d57bc584-7c1e-452b-b611-324692585bd3_533x.jpg?v=1775846242",
    "quadruped-robot-dog-bittle-servo-set": "https://www.petoi.com/cdn/shop/files/petoi_alloy_metal_servo_p1s_copy_533x.jpg?v=1775845882",
    "petoi-robot-controller-microbit-gamepad": "https://www.petoi.com/cdn/shop/files/Petoirobotcontrolleralone_533x.jpg?v=1775846183",
    "biboard-esp32-development-board-for-quadruped-robot": "https://www.petoi.com/cdn/shop/files/Petoi_robot_microcontroller_BiBoard_V1_-_Top_View_1946x_4b219d5d-0a9e-46c9-a512-e767defc489b_533x.webp?v=1775846161",
    "bittle-arm-extension-with-metal-servos": "https://www.petoi.com/cdn/shop/files/petoiarmextensionpackage-frontview-4x3_533x.jpg?v=1775846202",
  };
  PRODUCTS.forEach(p => { if (IMAGES[p.handle]) p.image = IMAGES[p.handle]; });

  // ---- CMS content (pulled from petoi.com at Step 3c; body is first-party HTML) ----
  const CONTENT = {
    "about": { title: "About Petoi", body: `
      <p>Petoi provides affordable, interactive, lifelike quadruped robots to the mass market. Our vision is to become the worldwide leader in personal companion robots that improve human wellbeing.</p>
      <p>We make bionic robot pets for adults and children alike, spanning robotics, STEM education, coding, AI learning, and companionship. Every Petoi robot is open source and built on Arduino and ESP32 platforms, so you can program and extend it with Raspberry Pi, Arduino modules, and a range of sensors.</p>
      <h2>From a viral project to 30,000+ robots</h2>
      <p>Petoi grew out of OpenCat, founder Rongzhong Li's viral robotics project launched in 2016. Our first product, the Nybble robot cat, succeeded on Indiegogo. In October 2020 the Bittle robot dog raised $567,000 on Kickstarter. We have since shipped over 30,000 robots worldwide.</p>
      <h2>Leadership</h2>
      <p>Founder and CEO Dr. Rongzhong Li holds a physics PhD and a computer science master's from Wake Forest University. COO Kai Mai brings 20+ years of product management and engineering experience.</p>` },
    "opencat": { title: "OpenCat Open Source Framework", body: `
      <p>OpenCat is the most-starred open-source quadruped robot platform on GitHub, created by Petoi founder Dr. Rongzhong Li. It powers Bittle X, Nybble Q, and Bittle X Arm: programmable four-legged robots for STEM education, makers, and university researchers.</p>
      <h2>Lowering the barrier to quadruped robotics</h2>
      <p>Walking robots have historically required heavy capital and specialized expertise. OpenCat lowers those barriers with practical engineering: hobbyist-grade high-performance servos in an optimized body frame, driven by affordable controllers (Arduino, ESP32, Raspberry Pi) and expandable with camera, IoT sensor, and voice modules.</p>
      <h2>An open ecosystem</h2>
      <p>OpenCat works much like Android's model: Petoi built and ships it in our products, but it was designed for broad adoption. Since its 2018 GitHub release, hundreds of non-Petoi robots have used the codebase. Petoi robots have shipped to users in 60+ countries, and DIY builders worldwide create custom quadrupeds with the published control code.</p>` },
    "system-overview": { title: "Programmable Robot System Overview", body: `
      <p>Petoi robots are programmable across three layers: block-based coding (Petoi Coding Blocks, a Scratch-like drag-and-drop environment), Python, and C++ via the Arduino IDE. Connect over wired serial, Bluetooth, or WiFi.</p>
      <p>The system is built on the OpenCat framework and supports expandable modules: an intelligent camera, an AI vision module, IoT sensor packs, and voice command. Add a Raspberry Pi for higher-level AI and computer vision.</p>` },
    "3d-print": { title: "3D-Print Robot Dog & Cat on OpenCat", body: `
      <p>Petoi publishes STL files so you can 3D-print parts and customize your robot. Combined with the open-source firmware, builders can modify and extend both the body and the behavior of OpenCat robots.</p>` },
    "faq": { title: "Frequently Asked Questions", body: `
      <h3>Are Petoi robots toys?</h3><p>Not toys, though they work as coding toys that spark STEM interest and teach robotics programming.</p>
      <h3>What age group is best suited?</h3><p>Ages 10+, from elementary through university, plus adults and seniors, depending on how deep you want to go.</p>
      <h3>What programming languages are supported?</h3><p>Block-based tools, C++ with the Arduino IDE, and Python.</p>
      <h3>Can beginners start with no experience?</h3><p>Yes, via the mobile apps or the graphical Petoi Coding Blocks environment.</p>
      <h3>What connection methods are available?</h3><p>Wired serial, Bluetooth, and WiFi.</p>
      <h3>Do they support voice commands?</h3><p>Bittle X and Nybble Q support voice; older models do not.</p>
      <h3>How long does assembly take?</h3><p>Bittle takes about 1 hour; Nybble takes 3+ hours. Pre-assembled options are available.</p>
      <h3>Is Raspberry Pi compatible?</h3><p>Yes, both families support Raspberry Pi; smaller Pi models are preferred.</p>
      <h3>Can parts be customized?</h3><p>Yes. STL files are provided for 3D printing, and the open-source firmware allows modifications.</p>
      <h3>What's the warranty?</h3><p>A one-year limited warranty with replacement parts and repair guidance.</p>
      <h3>Are volume discounts available?</h3><p>Yes, contact us for custom quotes on bulk and education purchases.</p>
      <h3>Is there a community?</h3><p>Yes, a forum at petoi.camp and the r/Petoi subreddit.</p>` },
    "shipping-returns": { title: "Shipping, 30-Day Returns & Warranty", body: `
      <h2>US shipping</h2><p>Free on orders over $200 (under $1000); otherwise $5.99. Economy 5-8 business days, Standard 3-4, Express 1-2, Next-day 1. Orders by 1 PM Pacific (Mon-Fri) qualify for same-day express/next-day processing.</p>
      <h2>International shipping</h2><p>Free on orders over $500 (under $1000); otherwise $20+. Delivery 7-25 business days by destination. Customers are responsible for customs charges.</p>
      <h2>Returns & exchanges</h2><p>Returns accepted within 30 days of receipt for most purchases (holiday orders extend to Jan 5 or 30 days, whichever is later). Items must be unused, with tags, in original packaging. Defective items require photo/video documentation. A restocking fee up to 20% may apply to non-defective returns.</p>
      <h2>Refunds & warranty</h2><p>Once a return is inspected we email you; approved refunds go to the original payment method. All robots carry a 1-year limited warranty covering defects.</p>` },
    "manuals": { title: "User Manuals", body: `<p>Full documentation and assembly guides are at <a href="https://guide.petoi.com/" rel="noopener">guide.petoi.com</a>.</p>` },
    "compare": { title: "Robot Pet Comparison", body: `
      <table class="cms-table"><thead><tr><th>Feature</th><th>Bittle X (dog)</th><th>Nybble Q (cat)</th></tr></thead><tbody>
      <tr><td>Degrees of freedom</td><td>9</td><td>11</td></tr>
      <tr><td>Body</td><td>Injection-molded (reassemblable)</td><td>3D-printed</td></tr>
      <tr><td>Processor</td><td>ESP32</td><td>ESP32 (BiBoard V1)</td></tr>
      <tr><td>Voice commands</td><td>35+ (10 custom)</td><td>35+ (10 custom)</td></tr>
      <tr><td>Assembly</td><td>~1 hour</td><td>3+ hours (pre-assembled available)</td></tr>
      <tr><td>From</td><td>$299</td><td>$435</td></tr></tbody></table>` },
    "retailers": { title: "Retailers", body: `<p>Buy from the official store, or from <a href="https://www.amazon.com/" rel="noopener">Amazon</a> and <a href="https://www.robotshop.com/" rel="noopener">Robotshop</a>.</p>` },
    "education": { title: "Bittle X for Robotics Education", body: `<p>Bittle X is built for the classroom: ages 10+, K-12 through college and robotics camps, with free curricula spanning block-based coding, Python, and C++. See our <a href="page.html?slug=curricula">curricula</a> and <a href="page.html?slug=educator-guide">educator guide</a>.</p>` },
    "educator-guide": { title: "Purchase Guide & FAQ for Educators", body: `<p>Volume and education discounts are available. <a href="contact.html?topic=edu">Contact us</a> for a custom quote, classroom bundles, and curriculum support.</p>` },
    "curricula": { title: "Robotics Curricula", body: `
      <h2>Block-based coding</h2><p>A free curriculum built on Petoi Coding Blocks, a Scratch-like drag-and-drop environment for K-12. Covers computing fundamentals, servo control, skill composition, IoT sensors, and creative projects. No prior coding needed.</p>
      <h2>4-session curriculum</h2><p>A condensed, structured block-based course for shorter classroom implementations.</p>
      <h2>Python</h2><p>For learners moving from visual programming to text-based Python with Petoi robots.</p>
      <h2>C++</h2><p>A free curriculum for advanced learners and developers seeking system-level control.</p>
      <p>Lesson plans for educators, video tutorials, and Skill Composer walkthroughs accompany the materials.</p>` },
    "research": { title: "Research & Academic Applications", body: `<p>Petoi robots serve as an open platform for robotics, IoT, and AI research at universities. The OpenCat framework, expandable sensors, and Raspberry Pi support make them a low-cost base for experimentation and coursework.</p>` },
    "resources": { title: "Resources", body: `<p>Documentation, downloads, STL files, and tutorials are available through <a href="https://guide.petoi.com/" rel="noopener">guide.petoi.com</a> and the OpenCat GitHub.</p>` },
    "showcases": { title: "Showcases", body: `<p>Projects from the Petoi community and partners, including university collaborations and contest winners.</p>` },
    "edu-showcases": { title: "Education Showcases", body: `<p>Classroom and camp projects built with Petoi robots.</p>` },
    "customer-love": { title: "Customers Love Petoi Robots", body: `<p>Educators, roboticists, and hobbyists share why they build with Petoi. See reviews on each product page.</p>` },
    "gallery": { title: "Robot Pet Gallery", body: `<p>Photos and videos of Bittle and Nybble in action.</p>` },
    "software-apps": { title: "Software & Apps", body: `<p>Control your robot with the Petoi mobile app, program with Petoi Coding Blocks, Python, or C++, and explore the OpenCat firmware.</p>` },
    "news": { title: "News", body: `<p>Petoi in the press: Fox News Bay Area, Make, TechCrunch, Financial Times, Digital Trends, Mashable, and more.</p>` },
    "forum": { title: "Forum Archive", body: `<p>Community discussion lives at petoi.camp and the <a href="https://www.reddit.com/r/Petoi/" rel="noopener">r/Petoi</a> subreddit.</p>` },
    "privacy": { title: "Privacy Policy", body: `<p>See the full privacy policy on the live site. Petoi handles personal data in line with applicable law, including for EU customers. [Full legal text to be migrated verbatim from petoi.com/policies/privacy-policy.]</p>` },
    "terms": { title: "Terms of Service", body: `<p>[Full terms of service to be migrated verbatim from petoi.com/policies/terms-of-service.]</p>` },
    "eu-withdrawal": { title: "EU Right of Withdrawal", body: `<p>EU customers have a 14-day right of withdrawal. Use the withdrawal form to cancel an order within the statutory period. [Full form and legal text to be migrated verbatim from petoi.com/pages/eu-withdrawal-form.]</p>` },
    "partnership": { title: "Partnership", body: `<p>Interested in distributing or building on Petoi? <a href="contact.html?topic=edu">Contact us</a> about partnership opportunities.</p>` },
    "affiliate": { title: "Affiliate & Collaborator Program", body: `<p>Join the affiliate and collaborator program to earn by sharing Petoi. Refer a friend for 5% off. See your <a href="account.html#referral">account</a> to get started.</p>` },
  };

  const readMore = h => `<p><a href="https://www.petoi.com/blogs/blog/${h}" rel="noopener">Read the full story at petoi.com</a></p>`;
  const BLOG = [
    { slug: "petoi-robots-on-ice-2026-news", title: "Petoi at Robots on Ice: When Kids Who Build Robots Get a Crowd", date: "2026-05-03",
      excerpt: "Petoi brought six robots to an ice rink for Robots on Ice 2026; one was swept off the ice by a giant spider robot in the opening seconds.",
      body: `<p>Last Saturday, Petoi brought six robots to an ice rink as part of Robots on Ice 2026, an annual event hosted by the Silicon Valley Ice Skating Association at Sharks Ice San Jose. The outing proved eventful: one robot was swept away by a giant spider machine within seconds of the demonstration beginning.</p>
      <p>The event, which has run since 2020, aims to spark enthusiasm for STEM education among young people. This year's gathering featured robots of various sizes, from a full-sized Doctor Who Dalek replica to a 250-pound six-legged machine fitted with custom ice skates.</p>
      <p>Petoi's COO Kai Mai attended with a full roster of quadruped and feline robots, accompanied by customer Amit Bnerje and his family. Bnerje's two sons, ages 10 and 7, had built several of the Petoi units themselves and displayed them publicly for the first time: "They've been coming to this event annually. This is their main exposure to robotics, just in front of people."</p>` },
    { slug: "robotics-ai-celebration-2026-winners", title: "Petoi Robotics & AI Celebration 2026 — Winners Announced", date: "2026-04-17",
      excerpt: "Winners and stories from Petoi's community celebration of National Robotics Week 2026.",
      body: `<p>Thank you to everyone who shared a story, cast a vote, or simply followed along during Petoi's community celebration of National Robotics Week 2026. Here are the winners and stories.</p>
      <p>The grand prize winner was Dorian Todd for "Building a Custom Quadruped with Petoi Motors! (The Sesame Robot Project)." Todd had created an open-source, affordable quadruped design costing $50-70. After entering an early prototype into a past Petoi competition, the company recognized his work and sent him motors, which enabled him to develop an upgraded version.</p>
      <p>Additional category winners received store credit and exclusive merchandise across community stories, classroom applications, and innovative robotics ideas. The celebration also recognized eight participants in a draw, and highlighted moments from the community, including an 80-year-old programmer in Singapore, educators bringing robots into classrooms across New Mexico, and research featuring Petoi robots at Harvard, CMU, and Google X.</p>` },
    { slug: "top-open-source-3d-printed-robots", title: "Top Open-Source 3D-Printed Robots for DIY Robotics & AI Projects", date: "2026-03-15",
      excerpt: "How makers can build functional robots from a desk, classroom, or makerspace using open-source designs and affordable 3D printing.",
      body: `<p>Getting into robotics is easier than ever. Thanks to open-source technology and affordable 3D printing, makers can now build functional robots from a desk, classroom, or makerspace using downloadable designs and widely available hardware.</p>
      <p>Many of these DIY robots are now used to experiment with "physical AI": systems that sense their environment, control motors, and interact with the real world.</p>
      <p>Below are some of the most popular open-source 3D-printed robot projects that makers, students, and researchers can build today.</p>` },
    { slug: "petoi-robotics-ai-celebration-2026-announcement", title: "National Robotics Week 2026: Petoi Robotics & AI Celebration", date: "2026-03-09",
      excerpt: "A community showcase for National Robotics Week featuring builders, coders, educators, and researchers.",
      body: `<p>A community showcase for National Robotics Week 2026, featuring builders, coders, educators, and researchers from across the Petoi community.</p>${readMore("petoi-robotics-ai-celebration-2026-announcement")}` },
    { slug: "spring-loaded-robot-claw-mechanism", title: "How Does the Petoi Open Claw Mechanism Snap So Fast?", date: "2026-02-26",
      excerpt: "A look at the spring-based design that enables rapid claw operation on Bittle's robotic arm.",
      body: `<p>A look at the spring-loaded design behind the Petoi open claw, and how it enables the rapid grip-and-release operation on Bittle's robotic arm.</p>${readMore("spring-loaded-robot-claw-mechanism")}` },
    { slug: "nybble-coding-robot-cat-and-robotics-projects", title: "Robotics Projects: How Coding Robot Cat Nybble Inspires Builders", date: "2026-02-10",
      excerpt: "How the Nybble coding robot cat inspires diverse robotics projects across DIY and AI applications.",
      body: `<p>How the Nybble coding robot cat inspires a range of robotics projects, from DIY builds to AI applications across the community.</p>${readMore("nybble-coding-robot-cat-and-robotics-projects")}` },
  ];
  function blogPost(slug){ return BLOG.find(b => b.slug === slug); }

  const FOOTER = {
    Petoi: [
      { label: "About us", href: "page.html?slug=about" },
      { label: "Blog", href: "blog.html" },
      { label: "Contact us", href: "contact.html" },
      { label: "Partnership", href: "page.html?slug=partnership" },
      { label: "Affiliate & collaborator program", href: "page.html?slug=affiliate" },
      { label: "Get 5% OFF by referral", href: "account.html#referral" },
    ],
    "Where to buy": [
      { label: "Official Store", href: "shop.html" },
      { label: "Amazon", href: "https://www.amazon.com/" },
      { label: "Robotshop", href: "https://www.robotshop.com/" },
    ],
    Support: [
      { label: "Compare robots", href: "page.html?slug=compare" },
      { label: "Shipping & returns", href: "page.html?slug=shipping-returns" },
      { label: "Return, refund, exchange & warranty", href: "page.html?slug=shipping-returns" },
      { label: "Privacy policy", href: "page.html?slug=privacy" },
      { label: "Terms of service", href: "page.html?slug=terms" },
      { label: "EU Right of Withdrawal", href: "page.html?slug=eu-withdrawal" },
    ],
  };

  const SOCIAL = [
    { name: "Twitter/X", href: "https://twitter.com/petoicamp" },
    { name: "Facebook", href: "https://www.facebook.com/Petoicamp" },
    { name: "Pinterest", href: "https://www.pinterest.com/petoicamp/" },
    { name: "Instagram", href: "https://www.instagram.com/petoicamp/" },
    { name: "TikTok", href: "https://www.tiktok.com/@petoicamp" },
    { name: "YouTube", href: "https://www.youtube.com/c/Petoi" },
    { name: "GitHub", href: "https://github.com/PetoiCamp" },
    { name: "Reddit", href: "https://www.reddit.com/r/Petoi/" },
    { name: "Hackster", href: "https://www.hackster.io/petoi" },
    { name: "Flipboard", href: "https://flipboard.com/@petoi" },
  ];
  const PAYMENTS = ["Amazon","Amex","Apple Pay","Diners","Discover","Google Pay","Mastercard","PayPal","Visa"];

  // i18n/currency: display-only conversion.
  const CURRENCIES = { USD: { symbol: "$", rate: 1 }, EUR: { symbol: "€", rate: 0.92 }, GBP: { symbol: "£", rate: 0.79 } };

  function product(handle){ return PRODUCTS.find(p=>p.handle===handle); }
  function variantPrice(p, label){
    if (!p) return 0;
    if (p.variants && label){ const v = p.variants.find(x=>x.label===label); if (v) return v.price; }
    return p.price;
  }
  function search(q){ q=(q||"").toLowerCase().trim(); if(!q) return [];
    return PRODUCTS.filter(p=>p.title.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)); }

  return { NAV, PRODUCTS, CONTENT, BLOG, FOOTER, SOCIAL, PAYMENTS, CURRENCIES, product, variantPrice, blogPost, search };
})();
