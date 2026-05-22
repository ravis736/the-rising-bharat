const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Article = require('./models/Article');
const Staff = require('./models/Staff');

const categories = [
  'government-sector', 'business-finance', 'world-news', 'crime-law',
  'environment', 'social-issues', 'latest-updates',
  'technology', 'ai-news', 'gaming',
  'lifestyle', 'entertainment', 'health-fitness', 'religion-culture',
  'education', 'jobs-career',
  'sports', 'science', 'automobile', 'facts-knowledge',
  'guest-posting',
];

const categoryLabels = {
  'government-sector': 'Government Sector', 'business-finance': 'Business & Finance',
  'world-news': 'World News', 'crime-law': 'Crime & Law', 'environment': 'Environment',
  'social-issues': 'Social Issues', 'latest-updates': 'Latest Updates',
  'technology': 'Technology', 'ai-news': 'AI News', 'gaming': 'Gaming',
  'lifestyle': 'Lifestyle', 'entertainment': 'Entertainment', 'health-fitness': 'Health & Fitness',
  'religion-culture': 'Religion & Culture', 'education': 'Education', 'jobs-career': 'Jobs & Career',
  'sports': 'Sports', 'science': 'Science', 'automobile': 'Automobile',
  'facts-knowledge': 'Facts & Knowledge', 'guest-posting': 'Guest Posting',
};

const mainCategoryMap = {
  'government-sector': 'public-government-affairs', 'business-finance': 'public-government-affairs',
  'world-news': 'public-government-affairs', 'crime-law': 'public-government-affairs',
  'environment': 'public-government-affairs', 'social-issues': 'public-government-affairs',
  'latest-updates': 'public-government-affairs',
  'technology': 'digital-future-tech', 'ai-news': 'digital-future-tech', 'gaming': 'digital-future-tech',
  'lifestyle': 'lifestyle-culture', 'entertainment': 'lifestyle-culture',
  'health-fitness': 'lifestyle-culture', 'religion-culture': 'lifestyle-culture',
  'education': 'education-careers', 'jobs-career': 'education-careers',
  'sports': 'sports-knowledge', 'science': 'sports-knowledge',
  'automobile': 'sports-knowledge', 'facts-knowledge': 'sports-knowledge',
  'guest-posting': 'community',
};

const sampleTitles = {
  'government-sector': [
    'New Government Scheme Aims to Boost Rural Infrastructure Development Across India',
    'Cabinet Approves Major Reforms in Public Sector Undertakings This Year',
    'Government Launches Digital Platform for Transparent Tender Processes',
    'Union Budget 2026: Key Highlights and Sector-Wise Allocations Announced',
    'State Governments Collaborate on Smart City Mission Expansion Plan',
    'New Policy Framework for E-Governance Services Implementation',
    'Government Announces Subsidy Program for Small and Medium Enterprises',
    'Public Sector Banks Report Improved Performance Under New Guidelines',
    'Central Government Launches Skill Development Initiative for Youth',
    'New Environmental Compliance Standards for Government Projects Released',
  ],
  'business-finance': [
    'Indian Startup Ecosystem Sees Record Investment Growth in Q1 2026',
    'Stock Market Reaches New Highs as Foreign Investment Inflows Surge',
    'RBI Announces New Guidelines for Digital Lending Platforms Compliance',
    'Global Economic Outlook 2026: Opportunities and Challenges for India',
    'Fintech Revolution: How Digital Payments Are Transforming Rural India',
    'Small Business Growth Strategies for the Post-Pandemic Economy',
    'Corporate Earnings Season: Top Performers and Market Expectations',
    'Real Estate Sector Shows Strong Recovery with Increased Demand',
    'International Trade Agreements Boost Export Opportunities for India',
    'Sustainable Investing: How ESG Criteria Are Shaping Business Decisions',
  ],
  'world-news': [
    'Global Climate Summit Reaches Historic Agreement on Carbon Emissions',
    'International Diplomatic Talks Focus on Regional Security Cooperation',
    'United Nations Releases New Report on Global Development Goals Progress',
    'Major Powers Discuss Trade Agreements at G20 Summit This Quarter',
    'Humanitarian Aid Reaches Millions Affected by Natural Disasters',
    'Global Health Organization Announces New Pandemic Preparedness Framework',
    'Cross-Border Infrastructure Projects Strengthen Regional Connectivity',
    'International Space Station Celebrates New Research Milestones',
    'Global Economic Forum Highlights Digital Transformation Challenges',
    'Peace Negotiations Progress in Ongoing International Conflicts',
  ],
  'crime-law': [
    'Supreme Court Delivers Landmark Judgment on Digital Privacy Rights',
    'Cybercrime Cases Rise Sharply: New Prevention Strategies Implemented',
    'Legal Reforms Proposed to Strengthen Women Safety Laws Nationwide',
    'High Court Orders Fast-Track Trials for Heinous Crimes Against Children',
    'New Anti-Corruption Bureau Task Force Launched to Tackle White-Collar Crime',
    'Forensic Technology Advances Help Solve Decades-Old Criminal Cases',
    'International Law Enforcement Collaboration Leads to Major Drug Bust',
    'Juvenile Justice System Undergoes Comprehensive Review and Reform',
    'New Cyber Laws Address Emerging Threats in Digital Payment Systems',
    'Police Modernization Program Introduces AI-Powered Crime Prediction Tools',
  ],
  'environment': [
    'Renewable Energy Capacity Crosses Major Milestone in India This Year',
    'New Wildlife Conservation Program Aims to Protect Endangered Species',
    'Air Quality Improvement Initiatives Show Promising Results in Urban Areas',
    'Climate Change Adaptation Strategies for Coastal Communities Released',
    'Plastic Waste Management Rules Strengthened to Reduce Ocean Pollution',
    'Forest Cover Increases Due to Large-Scale Afforestation Programs',
    'Sustainable Agriculture Practices Help Farmers Adapt to Climate Change',
    'Water Conservation Projects Bring Relief to Drought-Prone Regions',
    'Electric Vehicle Adoption Accelerates with New Government Incentives',
    'Biodiversity Hotspots Receive Enhanced Protection Under New Guidelines',
  ],
  'social-issues': [
    'Education Inequality: New Programs Aim to Bridge Rural-Urban Gap',
    'Healthcare Access Improves in Remote Areas Through Telemedicine Services',
    'Women Empowerment Initiatives Show Measurable Impact on Communities',
    'Mental Health Awareness Campaigns Gain Momentum Across the Country',
    'Clean Water Access Projects Transform Lives in Underserved Regions',
    'Affordable Housing Schemes Help Low-Income Families Achieve Homeownership',
    'Digital Literacy Programs Empower Rural Communities with Technology Skills',
    'Food Security Programs Expand to Reach Vulnerable Populations',
    'Social Justice Movements Drive Policy Changes for Marginalized Groups',
    'Community-Led Development Models Show Success in Poverty Reduction',
  ],
  'latest-updates': [
    'Breaking: Major Policy Announcement Expected Today from Government',
    'Trending: Viral Social Media Campaign Sparks National Conversation',
    'Alert: Important Weather Advisory Issued for Multiple States',
    'Live: Key Developments in Ongoing Parliamentary Session Updates',
    'Flash: International Summit Concludes with Historic Agreement Reached',
    'Trending Now: New Technology Innovation Goes Viral Worldwide',
    'Urgent: Health Advisory Issued as New Variant Detected in Region',
    'Developing Story: Major Infrastructure Project Inauguration Underway',
    'Just In: Economic Indicators Show Strong Growth in Latest Quarter',
    'Update: Follow-Up Report on Landmark Judicial Decision Published',
  ],
  'technology': [
    'Next-Generation Smartphone Chips Promise Revolutionary Performance Leap',
    'Cloud Computing Trends Reshaping Enterprise Digital Transformation Strategy',
    'Cybersecurity Best Practices for Protecting Personal Data Online',
    '5G Network Expansion Accelerates Across Rural and Urban Areas',
    'Open Source Software Communities Drive Innovation in Development Tools',
    'Blockchain Technology Applications Beyond Cryptocurrency: Real-World Uses',
    'Wearable Technology Market Sees Explosive Growth with New Innovations',
    'Quantum Computing Breakthroughs Promise New Era of Computational Power',
    'Edge Computing Revolution: How Local Processing Is Changing IoT',
    'Software Development Trends 2026: AI-Assisted Coding and Automation',
  ],
  'ai-news': [
    'GPT-5 Released: Next Generation AI Model Breaks All Previous Benchmarks',
    'AI-Powered Healthcare Diagnostics Achieve 99% Accuracy in Clinical Trials',
    'Machine Learning Algorithms Transform Supply Chain Management Systems',
    'Ethical AI Framework Adopted by Major Technology Companies Worldwide',
    'Natural Language Processing Advances Enable Seamless Multilingual Communication',
    'AI in Education: Personalized Learning Platforms Show Remarkable Results',
    'Robotics Industry Embraces AI for Advanced Manufacturing Automation',
    'Computer Vision Technology Revolutionizes Quality Control in Industry',
    'AI-Powered Climate Modeling Helps Predict Extreme Weather Events',
    'Autonomous Vehicle Technology Achieves New Safety Milestones in Testing',
  ],
  'gaming': [
    'Most Anticipated Game Releases of 2026: Complete Preview Guide',
    'Esports Championship Series Breaks Viewership Records Worldwide',
    'Cloud Gaming Services Transform How Players Access and Enjoy Games',
    'Indie Game Development Scene Thrives with New Tools and Platforms',
    'Virtual Reality Gaming Immersion Reaches New Levels with Latest Hardware',
    'Mobile Gaming Market Continues Dominant Growth Trajectory Globally',
    'Game Development Best Practices: Lessons from Top Studios Success',
    'Cross-Platform Gaming Unites Players Across Different Devices',
    'Retro Gaming Revival: Classic Titles Remastered for Modern Platforms',
    'Gaming Industry Employment: Career Opportunities and Growth Areas',
  ],
  'lifestyle': [
    'Minimalist Living: How Decluttering Your Space Transforms Your Life',
    'Sustainable Fashion Trends Redefining the Apparel Industry Standards',
    'Travel Destinations 2026: Unexplored Gems for Your Next Adventure',
    'Mindfulness Practices for Busy Professionals: A Complete Guide',
    'Home Decor Trends: Biophilic Design Brings Nature Indoors Beautifully',
    'Work-Life Balance Strategies That Actually Work in Modern Times',
    'Slow Living Movement: Embracing Quality Over Quantity in Daily Life',
    'Digital Detox: Reclaiming Your Time from Screen Addiction',
    'Urban Gardening: Growing Your Own Food in Small City Spaces',
    'Personal Style Evolution: Building a Wardrobe That Reflects Your Identity',
  ],
  'entertainment': [
    'Blockbuster Movie Season: Complete Guide to Summer 2026 Releases',
    'OTT Platform Wars: New Streaming Services Disrupt Entertainment Industry',
    'Music Industry Evolution: How AI Is Changing Music Production Process',
    'Celebrity Interviews: Exclusive Conversations with Industry Leaders',
    'Award Season Preview: Predictions for Major Film and TV Honors',
    'Independent Cinema Renaissance: Must-Watch Films at Film Festivals',
    'Podcast Revolution: How Audio Content Is Dominating Media Consumption',
    'Theater and Performing Arts Make Strong Comeback After Pandemic',
    'Web Series That Redefined Storytelling in the Digital Age Review',
    'Animation Industry Growth: New Techniques and Global Success Stories',
  ],
  'health-fitness': [
    'New Study Reveals Optimal Exercise Routine for Maximum Health Benefits',
    'Nutrition Science Updates: Latest Research on Diet and Longevity',
    'Mental Health Awareness: Breaking Stigma Around Seeking Professional Help',
    'Yoga and Meditation: Scientific Evidence Supporting Mind-Body Practices',
    'Sleep Optimization: Evidence-Based Strategies for Better Rest Quality',
    'Functional Fitness Training: Building Strength for Real-World Activities',
    'Plant-Based Diet Trends: Health Benefits and Nutritional Considerations',
    'Running Community: Training Plans for Beginners to Marathon Runners',
    'Workplace Wellness Programs That Improve Employee Health and Productivity',
    'Supplements and Vitamins: What Science Says About Popular Health Products',
  ],
  'religion-culture': [
    'Festival Celebrations Across India: Diversity in Unity and Traditions',
    'Spiritual Tourism: Sacred Destinations Gaining Popularity Among Travelers',
    'Interfaith Dialogue Initiatives Promote Understanding and Harmony',
    'Ancient Wisdom in Modern Times: Traditional Practices Find New Relevance',
    'Cultural Heritage Preservation: Protecting Historical Monuments and Sites',
    'Religious Festivals Calendar 2026: Important Dates and Celebrations',
    'Meditation Retreats: Combining Spirituality with Wellness Travel',
    'Traditional Arts and Crafts: Supporting Artisans and Cultural Legacy',
    'Community Temple Projects: Modern Architecture Meets Spiritual Design',
    'Pilgrimage Tourism: Ancient Routes Rediscovered by Modern Travelers',
  ],
  'education': [
    'National Education Policy Implementation: Progress and Challenges Report',
    'Online Learning Platforms Revolutionize Access to Quality Education',
    'STEM Education Initiatives Inspire Next Generation of Innovators',
    'Study Abroad Trends: Popular Destinations and Application Guidelines',
    'Scholarship Opportunities for Indian Students: Complete Guide 2026',
    'Skill-Based Education: How Vocational Training Is Gaining Recognition',
    'Digital Classrooms: Technology Integration in Modern Teaching Methods',
    'Exam Preparation Strategies for Competitive Entrance Tests Success',
    'Higher Education Innovations: New Programs and Interdisciplinary Approaches',
    'Adult Education Programs: Lifelong Learning Opportunities for Career Growth',
  ],
  'jobs-career': [
    'Government Job Notifications: Latest Recruitment Updates and Deadlines',
    'Remote Work Revolution: How to Build a Successful Work-from-Home Career',
    'Resume Writing Tips: Stand Out in Competitive Job Market Applications',
    'Interview Preparation Guide: Common Questions and Expert Answer Strategies',
    'Career Change Guide: Successfully Transitioning to a New Industry Path',
    'Freelancing Opportunities: Building a Sustainable Independent Career',
    'Corporate Culture Evolution: What Employees Value in Modern Workplaces',
    'Leadership Skills Development: Pathways to Management Positions',
    'Networking Strategies for Professional Growth in Digital Age',
    'Salary Negotiation Tactics: How to Get the Compensation You Deserve',
  ],
  'sports': [
    'Cricket World Cup 2026: Complete Tournament Preview and Team Analysis',
    'Olympic Games Preparation: Athletes Training Regimens and Diet Plans',
    'Indian Premier League Season Preview: Teams, Players and Predictions',
    'Football Transfer Window: Major Moves and Expected Signings Analysis',
    'Tennis Grand Slam Season: Top Contenders and Rising Stars Watch',
    'Badminton Championships: Indian Shuttlers Aim for Global Dominance',
    'Athletics Meet Preview: Record-Breaking Performances Expected This Season',
    'Wrestling and Combat Sports: Indian Athletes Making International Mark',
    'Basketball League Expansion: Growing Popularity in Indian Markets',
    'Sports Infrastructure Development: New Stadiums and Training Facilities',
  ],
  'science': [
    'ISRO Space Missions: Upcoming Launches and Interplanetary Exploration Plans',
    'Mars Colony Research: Latest Developments in Space Habitat Technology',
    'Genetic Engineering Breakthroughs: CRISPR Applications in Medicine Today',
    'Particle Physics Discovery: New Subatomic Particle Confirmed at CERN',
    'Ocean Exploration: Deep Sea Discoveries Reveal Unknown Marine Species',
    'Climate Science Research: Latest Findings on Global Warming Impacts',
    'Archaeological Discoveries: Ancient Civilizations Unearthed in New Excavations',
    'Neuroscience Advances: Understanding Brain Plasticity and Memory Formation',
    'Renewable Energy Science: Next-Generation Solar Cell Efficiency Breakthrough',
    'Biotechnology Innovations: Lab-Grown Organs Move Closer to Clinical Use',
  ],
  'automobile': [
    'Electric Vehicle Review: Top EVs Coming to Indian Market in 2026',
    'Car Comparison: Best Mid-Size Sedans for Family and Commuter Use',
    'Two-Wheeler Industry Trends: Electric Scooters Lead Market Growth',
    'Luxury Car Segment: New Launches and Technology Features Showcase',
    'Auto Expo Highlights: Innovative Concepts and Production-Ready Models',
    'Fuel Efficiency Guide: Tips to Maximize Your Vehicle Mileage Savings',
    'SUV Market Analysis: Why Sports Utility Vehicles Dominate Indian Roads',
    'Connected Car Technology: How IoT Is Transforming Driving Experience',
    'Motorcycle Reviews: Performance Bikes for Enthusiasts and Daily Riders',
    'Automotive Safety Ratings: Understanding NCAP Scores and Safety Features',
  ],
  'facts-knowledge': [
    'Ancient India Contributions to Mathematics and Science World Recognition',
    'Interesting Historical Facts That Will Change How You See the World',
    'Geography Mysteries: Unexplained Natural Phenomena Around the Globe',
    'Human Body Facts: Amazing Abilities and Surprising Biological Wonders',
    'World Records: Most Extraordinary Achievements by Humans and Nature',
    'Language Origins: How Different Languages Evolved and Influenced Each Other',
    'Space Facts: Mind-Blowing Information About Our Universe and Beyond',
    'Animal Kingdom Wonders: Extraordinary Species and Their Unique Abilities',
    'Historical Inventions: Accidental Discoveries That Changed Human Civilization',
    'Brain Facts: Understanding How Your Mind Processes Information Daily',
  ],
  'guest-posting': [
    'How to Write Compelling Guest Posts That Drive Traffic and Engagement',
    'Guest Blogging Best Practices: A Complete Guide for Aspiring Writers',
    'Why Guest Posting Is Essential for Building Your Online Authority',
    'My Experience Writing for The Rising Bharat: A Contributor Journey',
    'Top Tips for Getting Your Guest Post Accepted on Major Platforms',
    'The Art of Storytelling in Digital Content: Lessons from Top Bloggers',
    'Building Your Writing Portfolio Through Strategic Guest Contributions',
    'Guest Posting Ethics: Maintaining Quality and Authenticity Standards',
    'From Guest Blogger to Regular Contributor: A Success Story Path',
    'Content Marketing Through Guest Blogging: Strategies That Work in 2026',
  ],
};

const taglines = {
  'government-sector': [
    'Comprehensive analysis of recent policy developments and their impact on citizens.',
    'Understanding the latest government initiatives for public welfare and development.',
    'Detailed overview of administrative reforms shaping India governance landscape.',
  ],
  'business-finance': [
    'Expert insights into market trends, investment opportunities, and economic growth.',
    'Analysis of financial developments affecting businesses and consumers alike.',
    'Comprehensive coverage of corporate news and economic policy changes.',
  ],
  'world-news': [
    'Global perspective on international events shaping our interconnected world.',
    'In-depth reporting on diplomatic developments and international cooperation.',
    'Analysis of worldwide events and their implications for regional stability.',
  ],
  'crime-law': [
    'Detailed coverage of legal developments and crime prevention strategies.',
    'Understanding the justice system through landmark cases and reforms.',
    'Analysis of emerging legal challenges in the digital age.',
  ],
  'environment': [
    'Exploring solutions for environmental challenges and sustainable development.',
    'Updates on conservation efforts and climate action initiatives worldwide.',
    'Understanding the impact of climate change and mitigation strategies.',
  ],
  'social-issues': [
    'Examining social challenges and community-driven solutions for change.',
    'Stories of resilience and progress in addressing societal concerns.',
    'Analysis of social policies and their impact on communities.',
  ],
  'latest-updates': [
    'Breaking news and trending stories keeping you informed in real-time.',
    'Quick updates on developing stories and important announcements.',
    'Stay informed with the latest happenings across all sectors.',
  ],
  'technology': [
    'Exploring cutting-edge innovations transforming how we live and work.',
    'Deep dives into emerging technologies shaping the digital future.',
    'Reviews and analysis of the latest gadgets and software solutions.',
  ],
  'ai-news': [
    'Latest breakthroughs in artificial intelligence and machine learning.',
    'Understanding AI impact across industries and everyday applications.',
    'Analysis of AI developments and their ethical implications.',
  ],
  'gaming': [
    'Comprehensive gaming coverage from reviews to industry developments.',
    'Exploring the evolving landscape of interactive entertainment.',
    'Updates on game releases, esports events, and gaming culture.',
  ],
  'lifestyle': [
    'Curated content for modern living across fashion, travel, and wellness.',
    'Tips and inspiration for a balanced and fulfilling lifestyle.',
    'Exploring trends that shape how we live, work, and relax.',
  ],
  'entertainment': [
    'Complete entertainment coverage from films to music and streaming.',
    'Reviews, previews, and behind-the-scenes stories from entertainment world.',
    'Stay updated with the best in movies, shows, and celebrity news.',
  ],
  'health-fitness': [
    'Evidence-based health advice and fitness tips for better wellbeing.',
    'Expert guidance on nutrition, exercise, and mental health.',
    'Your comprehensive resource for healthy living and wellness.',
  ],
  'religion-culture': [
    'Exploring the rich tapestry of religious traditions and cultural heritage.',
    'Understanding diverse cultural practices and spiritual traditions.',
    'Connecting ancient wisdom with contemporary life and values.',
  ],
  'education': [
    'Educational resources and updates for students, teachers, and parents.',
    'Comprehensive coverage of academic developments and learning opportunities.',
    'Your guide to educational excellence and lifelong learning.',
  ],
  'jobs-career': [
    'Career guidance and job market insights for professionals at all levels.',
    'Practical advice for career growth and professional development.',
    'Your resource for job opportunities and career advancement strategies.',
  ],
  'sports': [
    'Exciting sports coverage from cricket to football and beyond.',
    'Match analysis, player profiles, and sporting event highlights.',
    'Complete sports news and updates for passionate fans.',
  ],
  'science': [
    'Fascinating discoveries and scientific breakthroughs explained simply.',
    'Exploring the wonders of science from space to microscopic worlds.',
    'Making complex scientific concepts accessible and engaging.',
  ],
  'automobile': [
    'Latest automotive news, reviews, and industry developments.',
    'Expert vehicle reviews and comparisons for informed decisions.',
    'Your complete guide to cars, bikes, and automotive technology.',
  ],
  'facts-knowledge': [
    'Interesting facts and knowledge that expand your understanding of the world.',
    'Discover amazing information about history, science, and human achievements.',
    'Feed your curiosity with fascinating facts and educational content.',
  ],
  'guest-posting': [
    'Expert guest contributions from writers and industry professionals.',
    'Quality content from our community of talented guest authors.',
    'Diverse perspectives and insights from guest contributors worldwide.',
  ],
};

const faqSets = [
  [
    { question: 'What is this article about?', answer: 'This article provides comprehensive coverage of the topic with expert analysis and insights.' },
    { question: 'Who is this information for?', answer: 'This content is designed for readers seeking in-depth understanding of the subject matter.' },
    { question: 'Where can I find more information?', answer: 'Explore related articles on our platform for additional insights and updates.' },
  ],
  [
    { question: 'Why is this topic important?', answer: 'Understanding this topic helps readers stay informed about key developments affecting their lives.' },
    { question: 'How often is this updated?', answer: 'We regularly update our content to reflect the latest developments and information.' },
  ],
  [
    { question: 'What are the key takeaways?', answer: 'The article highlights important trends, developments, and practical insights for readers.' },
    { question: 'Can I share this article?', answer: 'Yes, please use the social sharing buttons to share this content with your network.' },
    { question: 'How can I contribute?', answer: 'Contact us through our platform if you would like to contribute similar content.' },
  ],
];

const tagsByCategory = {
  'government-sector': ['government', 'policy', 'public-sector', 'governance', 'reforms', 'india', 'schemes', 'development'],
  'business-finance': ['business', 'finance', 'economy', 'investment', 'market', 'startup', 'banking', 'trade'],
  'world-news': ['world', 'international', 'global', 'diplomacy', 'foreign-affairs', 'geopolitics', 'UN', 'summit'],
  'crime-law': ['crime', 'law', 'legal', 'cybercrime', 'justice', 'supreme-court', 'police', 'judiciary'],
  'environment': ['environment', 'climate', 'renewable-energy', 'conservation', 'pollution', 'wildlife', 'sustainability', 'green'],
  'social-issues': ['social', 'inequality', 'education', 'healthcare', 'women-empowerment', 'human-rights', 'community', 'welfare'],
  'latest-updates': ['breaking-news', 'trending', 'updates', 'current-affairs', 'news-alert', 'developing-story', 'live', 'flash'],
  'technology': ['technology', 'smartphone', 'software', 'cybersecurity', 'cloud', 'blockchain', 'IoT', 'digital'],
  'ai-news': ['AI', 'artificial-intelligence', 'machine-learning', 'robotics', 'automation', 'deep-learning', 'neural-networks', 'NLP'],
  'gaming': ['gaming', 'esports', 'console', 'PC-gaming', 'mobile-gaming', 'VR', 'game-reviews', 'indie-games'],
  'lifestyle': ['lifestyle', 'fashion', 'travel', 'home-decor', 'wellness', 'mindfulness', 'minimalism', 'sustainability'],
  'entertainment': ['entertainment', 'movies', 'music', 'OTT', 'streaming', 'celebrity', 'theater', 'web-series'],
  'health-fitness': ['health', 'fitness', 'nutrition', 'mental-health', 'exercise', 'yoga', 'wellness', 'diet'],
  'religion-culture': ['religion', 'culture', 'festivals', 'spirituality', 'tradition', 'heritage', 'temple', 'pilgrimage'],
  'education': ['education', 'exam', 'scholarship', 'online-learning', 'STEM', 'career', 'college', 'study-tips'],
  'jobs-career': ['jobs', 'career', 'recruitment', 'interview', 'resume', 'remote-work', 'freelancing', 'professional-development'],
  'sports': ['sports', 'cricket', 'football', 'olympics', 'tennis', 'badminton', 'IPL', 'athletics'],
  'science': ['science', 'space', 'ISRO', 'research', 'physics', 'biology', 'discovery', 'innovation'],
  'automobile': ['automobile', 'cars', 'bikes', 'EV', 'electric-vehicle', 'auto-expo', 'reviews', 'technology'],
  'facts-knowledge': ['facts', 'knowledge', 'history', 'geography', 'science-facts', 'world-records', 'did-you-know', 'learning'],
  'guest-posting': ['guest-post', 'blogging', 'content-writing', 'SEO', 'digital-marketing', 'writing-tips', 'contribute', 'submission'],
};

const imageIds = {};

categories.forEach(cat => {
  imageIds[cat] = Array.from({ length: 10 }, (_, i) => `seed-${cat}-${i + 1}`);
});

function generateContent(title, category) {
  const paragraphs = [
    `<p>The Rising Bharat brings you an exclusive and comprehensive analysis of <strong>${title}</strong>. This article delves deep into the subject matter, providing readers with valuable insights and up-to-date information.</p>`,
    `<p>In recent developments surrounding this topic, experts have highlighted several key factors that deserve attention. The implications of these developments extend across multiple sectors and communities, making it essential for informed citizens to stay updated.</p>`,
    `<h2>Understanding the Context</h2><p>The landscape of ${categoryLabels[category] || 'this field'} is constantly evolving. New policies, technologies, and social changes are reshaping how we understand and interact with this domain. This article aims to provide clarity amidst the complexity.</p>`,
    `<p>According to industry experts and official sources, the trends observed in this area indicate significant shifts that will impact stakeholders at various levels. From government bodies to individual citizens, the ripple effects of these changes are far-reaching.</p>`,
    `<h2>Key Highlights and Analysis</h2><p>Our team has analyzed data from multiple reliable sources to bring you a nuanced perspective. The following points summarize the most critical aspects of this topic:</p><ul><li>Significant developments have been observed in recent months</li><li>Expert opinions converge on several key recommendations</li><li>Future outlook suggests continued evolution and growth</li><li>Community engagement remains crucial for successful implementation</li></ul>`,
    `<p>The Rising Bharat remains committed to delivering accurate, timely, and insightful content to our readers. We encourage you to share your thoughts and perspectives in the comments section below.</p>`,
    `<h2>Looking Ahead</h2><p>As we move forward, staying informed about ${categoryLabels[category] || 'this topic'} will become increasingly important. Subscribe to our newsletter to receive regular updates and exclusive content directly in your inbox.</p>`,
    `<p>We hope this article has provided valuable insights. For more in-depth coverage of related topics, explore our other articles in the ${categoryLabels[category] || 'related'} section.</p>`,
  ];
  return paragraphs.join('\n\n');
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Article.deleteMany({});
    console.log('Cleared existing articles');

    let adminStaff = await Staff.findOne({ role: 'admin' });
    if (!adminStaff) {
      adminStaff = await Staff.create({
        username: 'admin',
        email: 'admin@therisingbharat.com',
        password: 'Admin@123',
        role: 'admin',
        isActive: true,
        isVerified: true,
      });
      console.log('Created admin staff account');
    }

    let totalCreated = 0;
    for (const category of categories) {
      const titles = sampleTitles[category];
      const taglineList = taglines[category];
      const categoryTags = tagsByCategory[category];

      for (let i = 0; i < 10; i++) {
        const title = titles[i % titles.length];
        const uniqueTitle = `${title} - Part ${i + 1}`;
        const tagline = taglineList[i % taglineList.length];
        const faqs = faqSets[i % faqSets.length];
        const tags = categoryTags.slice(0, 4 + (i % 4));

        await Article.create({
          pageTitle: uniqueTitle,
          metaDescription: tagline,
          metaKeywords: tags.join(', '),
          category,
          mainCategory: mainCategoryMap[category],
          title: uniqueTitle,
          tagline,
          tags,
          content: generateContent(uniqueTitle, category),
          featuredImage: `https://picsum.photos/seed/${category}-${i + 1}/1200/600`,
          imageAltText: `Featured image for ${uniqueTitle}`,
          imageSourceLink: 'https://picsum.photos',
          faqs,
          author: adminStaff._id,
          authorName: adminStaff.username,
          readingTime: Math.ceil(generateContent(uniqueTitle, category).split(/\s+/).length / 200),
          isPublished: true,
          publishedAt: new Date(Date.now() - i * 3600000),
        });
        totalCreated++;
      }
      console.log(`Created 10 articles for category: ${category}`);
    }

    console.log(`\nSeed completed! Total articles created: ${totalCreated}`);
    console.log(`Admin credentials - Email: admin@therisingbharat.com, Password: Admin@123`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
