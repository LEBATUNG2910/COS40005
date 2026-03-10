// ============================================================================
// HireWiseDB - MongoDB Migration Script
// Run: mongosh < hirewise_mongo_init.js
// ============================================================================

// Tạo / chuyển sang database
use("HireWiseDB");

// ==========================================================================================
// Drop collections cũ nếu tồn tại
// ==========================================================================================
const collections = [
  "users", "refreshTokens", "resumeTemplates", "cvUploads", "skills",
  "cvAnalyses", "cvAnalysisSkills", "aiInsights", "aiSuggestions",
  "learningResources", "pricingPlans", "planFeatures", "userSubscriptions",
  "teamMembers", "redditCache", "auditLogs"
];

collections.forEach(col => {
  db.getCollection(col).drop();
});

// ============================================================================
// 1. USERS - Quản lý người dùng
// ============================================================================
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "fullName", "email", "phoneNumber", "passwordHash", "gender"],
      properties: {
        _id:             { bsonType: "string" },
        fullName:        { bsonType: "string", maxLength: 150 },
        email:           { bsonType: "string", maxLength: 255 },
        phoneNumber:     { bsonType: "string", maxLength: 20 },
        passwordHash:    { bsonType: "string", maxLength: 500 },
        gender:          { bsonType: "string", enum: ["Male", "Female", "Other"] },
        language:        { bsonType: "string", enum: ["English", "Spanish", "French", "German", "Vietnamese"] },
        newsletterOptIn: { bsonType: "bool" },
        avatarUrl:       { bsonType: ["string", "null"], maxLength: 500 },
        isActive:        { bsonType: "bool" },
        isDeleted:       { bsonType: "bool" },
        createdAt:       { bsonType: "date" },
        updatedAt:       { bsonType: "date" }
      }
    }
  }
});

db.users.createIndex({ email: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
db.users.createIndex({ phoneNumber: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

// ============================================================================
// 2. REFRESH TOKENS - Quản lý JWT sessions & Remember Me
// ============================================================================
db.createCollection("refreshTokens", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "userId", "token", "expiresAt"],
      properties: {
        _id:        { bsonType: "string" },
        userId:     { bsonType: "string" },
        token:      { bsonType: "string", maxLength: 500 },
        expiresAt:  { bsonType: "date" },
        rememberMe: { bsonType: "bool" },
        deviceInfo: { bsonType: ["string", "null"], maxLength: 500 },
        ipAddress:  { bsonType: ["string", "null"], maxLength: 45 },
        isRevoked:  { bsonType: "bool" },
        createdAt:  { bsonType: "date" }
      }
    }
  }
});

db.refreshTokens.createIndex({ userId: 1 }, { partialFilterExpression: { isRevoked: false } });
db.refreshTokens.createIndex({ token: 1 }, { partialFilterExpression: { isRevoked: false } });

// ============================================================================
// 3. RESUME TEMPLATES
// ============================================================================
db.createCollection("resumeTemplates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "name", "slug"],
      properties: {
        _id:          { bsonType: "string" },
        name:         { bsonType: "string", maxLength: 100 },
        slug:         { bsonType: "string", maxLength: 100 },
        description:  { bsonType: ["string", "null"], maxLength: 500 },
        thumbnailUrl: { bsonType: ["string", "null"], maxLength: 500 },
        category:     { bsonType: "string" },
        isActive:     { bsonType: "bool" },
        sortOrder:    { bsonType: "int" },
        createdAt:    { bsonType: "date" }
      }
    }
  }
});

db.resumeTemplates.createIndex({ slug: 1 }, { unique: true });

// Seed resume templates
db.resumeTemplates.insertMany([
  { _id: "rt01", name: "Double Column",            slug: "double-column",            description: "Classic two-column layout",                 category: "Standard", isActive: true, sortOrder: 1,  createdAt: new Date() },
  { _id: "rt02", name: "Ivy League",               slug: "ivy-league",               description: "Professional academic-style template",      category: "Standard", isActive: true, sortOrder: 2,  createdAt: new Date() },
  { _id: "rt03", name: "Elegant",                  slug: "elegant",                  description: "Clean and refined design",                  category: "Standard", isActive: true, sortOrder: 3,  createdAt: new Date() },
  { _id: "rt04", name: "Contemporary",             slug: "contemporary",             description: "Modern and fresh layout",                   category: "Modern",   isActive: true, sortOrder: 4,  createdAt: new Date() },
  { _id: "rt05", name: "Polished",                 slug: "polished",                 description: "Sleek and well-structured",                 category: "Modern",   isActive: true, sortOrder: 5,  createdAt: new Date() },
  { _id: "rt06", name: "Modern",                   slug: "modern",                   description: "Minimalist modern design",                  category: "Modern",   isActive: true, sortOrder: 6,  createdAt: new Date() },
  { _id: "rt07", name: "Creative",                 slug: "creative",                 description: "Bold and visually engaging",                category: "Creative", isActive: true, sortOrder: 7,  createdAt: new Date() },
  { _id: "rt08", name: "Timeline",                 slug: "timeline",                 description: "Chronological timeline format",             category: "Creative", isActive: true, sortOrder: 8,  createdAt: new Date() },
  { _id: "rt09", name: "Stylish",                  slug: "stylish",                  description: "Eye-catching and trendy",                   category: "Creative", isActive: true, sortOrder: 9,  createdAt: new Date() },
  { _id: "rt10", name: "Single Column",            slug: "single-column",            description: "Simple one-column layout",                  category: "Standard", isActive: true, sortOrder: 10, createdAt: new Date() },
  { _id: "rt11", name: "Elegant with Logos",       slug: "elegant-with-logos",       description: "Elegant design with company logos",         category: "Premium",  isActive: true, sortOrder: 11, createdAt: new Date() },
  { _id: "rt12", name: "Double Column with Logos", slug: "double-column-with-logos", description: "Two-column design with organization logos", category: "Premium",  isActive: true, sortOrder: 12, createdAt: new Date() }
]);

// ============================================================================
// 4. CV UPLOADS - Lưu trữ CV đã upload
// ============================================================================
db.createCollection("cvUploads", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "userId", "templateId", "originalFileName", "storedFilePath", "fileSize", "mimeType"],
      properties: {
        _id:              { bsonType: "string" },
        userId:           { bsonType: "string" },
        templateId:       { bsonType: "string" },
        originalFileName: { bsonType: "string", maxLength: 255 },
        storedFilePath:   { bsonType: "string", maxLength: 500 },
        fileSize:         { bsonType: "long", minimum: 1, maximum: 10485760 },
        mimeType:         { bsonType: "string", maxLength: 100 },
        pageCount:        { bsonType: "int" },
        extractedText:    { bsonType: ["string", "null"] },
        extractionMethod: { bsonType: ["string", "null"], enum: ["pdftotext", "pdf-parse", null] },
        isLatest:         { bsonType: "bool" },
        uploadedAt:       { bsonType: "date" }
      }
    }
  }
});

db.cvUploads.createIndex({ userId: 1, isLatest: 1 });

// ============================================================================
// 5. SKILLS CATALOG - Danh mục 60+ kỹ năng
// ============================================================================
db.createCollection("skills", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "name", "category"],
      properties: {
        _id:      { bsonType: "string" },
        name:     { bsonType: "string", maxLength: 100 },
        category: { bsonType: "string" },
        isActive: { bsonType: "bool" }
      }
    }
  }
});

db.skills.createIndex({ name: 1 }, { unique: true });

// Seed skills catalog (77 skills)
db.skills.insertMany([
  // Programming Languages
  { _id: "sk001", name: "JavaScript",      category: "Language",    isActive: true },
  { _id: "sk002", name: "TypeScript",      category: "Language",    isActive: true },
  { _id: "sk003", name: "Python",          category: "Language",    isActive: true },
  { _id: "sk004", name: "Java",            category: "Language",    isActive: true },
  { _id: "sk005", name: "C++",             category: "Language",    isActive: true },
  { _id: "sk006", name: "C#",              category: "Language",    isActive: true },
  { _id: "sk007", name: "Go",              category: "Language",    isActive: true },
  { _id: "sk008", name: "Rust",            category: "Language",    isActive: true },
  { _id: "sk009", name: "PHP",             category: "Language",    isActive: true },
  { _id: "sk010", name: "Ruby",            category: "Language",    isActive: true },
  { _id: "sk011", name: "Swift",           category: "Language",    isActive: true },
  { _id: "sk012", name: "Kotlin",          category: "Language",    isActive: true },
  { _id: "sk013", name: "Scala",           category: "Language",    isActive: true },

  // Frontend Frameworks
  { _id: "sk014", name: "React",           category: "Framework",   isActive: true },
  { _id: "sk015", name: "Vue",             category: "Framework",   isActive: true },
  { _id: "sk016", name: "Angular",         category: "Framework",   isActive: true },
  { _id: "sk017", name: "NextJS",          category: "Framework",   isActive: true },
  { _id: "sk018", name: "HTML",            category: "Framework",   isActive: true },
  { _id: "sk019", name: "CSS",             category: "Framework",   isActive: true },
  { _id: "sk020", name: "Tailwind",        category: "Framework",   isActive: true },
  { _id: "sk021", name: "Redux",           category: "Framework",   isActive: true },
  { _id: "sk022", name: "GraphQL",         category: "Framework",   isActive: true },
  { _id: "sk023", name: "Webpack",         category: "Tool",        isActive: true },
  { _id: "sk024", name: "Vite",            category: "Tool",        isActive: true },

  // Backend Frameworks
  { _id: "sk025", name: "NodeJS",          category: "Framework",   isActive: true },
  { _id: "sk026", name: "NestJS",          category: "Framework",   isActive: true },
  { _id: "sk027", name: "Express",         category: "Framework",   isActive: true },
  { _id: "sk028", name: "Django",          category: "Framework",   isActive: true },
  { _id: "sk029", name: "Spring",          category: "Framework",   isActive: true },
  { _id: "sk030", name: "FastAPI",         category: "Framework",   isActive: true },
  { _id: "sk031", name: "Laravel",         category: "Framework",   isActive: true },
  { _id: "sk032", name: "Flask",           category: "Framework",   isActive: true },

  // Databases
  { _id: "sk033", name: "PostgreSQL",      category: "Database",    isActive: true },
  { _id: "sk034", name: "MySQL",           category: "Database",    isActive: true },
  { _id: "sk035", name: "MongoDB",         category: "Database",    isActive: true },
  { _id: "sk036", name: "Redis",           category: "Database",    isActive: true },
  { _id: "sk037", name: "Elasticsearch",   category: "Database",    isActive: true },
  { _id: "sk038", name: "SQLite",          category: "Database",    isActive: true },
  { _id: "sk039", name: "Firebase",        category: "Database",    isActive: true },

  // DevOps & Cloud
  { _id: "sk040", name: "Docker",          category: "DevOps",      isActive: true },
  { _id: "sk041", name: "Kubernetes",      category: "DevOps",      isActive: true },
  { _id: "sk042", name: "AWS",             category: "DevOps",      isActive: true },
  { _id: "sk043", name: "GCP",             category: "DevOps",      isActive: true },
  { _id: "sk044", name: "Azure",           category: "DevOps",      isActive: true },
  { _id: "sk045", name: "Terraform",       category: "DevOps",      isActive: true },
  { _id: "sk046", name: "Ansible",         category: "DevOps",      isActive: true },
  { _id: "sk047", name: "Jenkins",         category: "DevOps",      isActive: true },
  { _id: "sk048", name: "GitHub Actions",  category: "DevOps",      isActive: true },
  { _id: "sk049", name: "Git",             category: "Tool",        isActive: true },
  { _id: "sk050", name: "Linux",           category: "DevOps",      isActive: true },
  { _id: "sk051", name: "CI/CD",           category: "DevOps",      isActive: true },

  // Methodology & Architecture
  { _id: "sk052", name: "REST API",        category: "Methodology", isActive: true },
  { _id: "sk053", name: "Microservices",   category: "Methodology", isActive: true },
  { _id: "sk054", name: "Agile",           category: "Methodology", isActive: true },
  { _id: "sk055", name: "Scrum",           category: "Methodology", isActive: true },
  { _id: "sk056", name: "Fullstack",       category: "Methodology", isActive: true },
  { _id: "sk057", name: "OOP",             category: "Methodology", isActive: true },
  { _id: "sk058", name: "SOLID",           category: "Methodology", isActive: true },
  { _id: "sk059", name: "Design Pattern",  category: "Methodology", isActive: true },

  // AI/ML
  { _id: "sk060", name: "Machine Learning", category: "AI/ML",     isActive: true },
  { _id: "sk061", name: "Deep Learning",    category: "AI/ML",     isActive: true },
  { _id: "sk062", name: "TensorFlow",       category: "AI/ML",     isActive: true },
  { _id: "sk063", name: "PyTorch",          category: "AI/ML",     isActive: true },
  { _id: "sk064", name: "Pandas",           category: "AI/ML",     isActive: true },
  { _id: "sk065", name: "NumPy",            category: "AI/ML",     isActive: true },

  // Tools
  { _id: "sk066", name: "Figma",           category: "Tool",        isActive: true },
  { _id: "sk067", name: "Jira",            category: "Tool",        isActive: true },
  { _id: "sk068", name: "Postman",         category: "Tool",        isActive: true },
  { _id: "sk069", name: "Jest",            category: "Tool",        isActive: true },
  { _id: "sk070", name: "Cypress",         category: "Tool",        isActive: true },
  { _id: "sk071", name: "Swagger",         category: "Tool",        isActive: true },

  // Messaging & Cloud Functions
  { _id: "sk072", name: "RabbitMQ",        category: "DevOps",      isActive: true },
  { _id: "sk073", name: "Kafka",           category: "DevOps",      isActive: true },
  { _id: "sk074", name: "Apollo",          category: "Framework",   isActive: true },
  { _id: "sk075", name: "Serverless",      category: "DevOps",      isActive: true },
  { _id: "sk076", name: "Lambda",          category: "DevOps",      isActive: true },
  { _id: "sk077", name: "Cloud Functions", category: "DevOps",      isActive: true }
]);

// ============================================================================
// 6. CV ANALYSES - Phiên phân tích CV vs JD
// ============================================================================
db.createCollection("cvAnalyses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "userId", "cvUploadId", "jobDescription", "matchScore"],
      properties: {
        _id:             { bsonType: "string" },
        userId:          { bsonType: "string" },
        cvUploadId:      { bsonType: "string" },
        jobDescription:  { bsonType: "string" },
        matchScore:      { bsonType: "double", minimum: 0, maximum: 100 },
        bm25RawScore:    { bsonType: ["double", "null"] },
        skillMatchRatio: { bsonType: ["double", "null"] },
        overallFeedback: { bsonType: ["string", "null"] },
        analyzedAt:      { bsonType: "date" }
      }
    }
  }
});

db.cvAnalyses.createIndex({ userId: 1 });
db.cvAnalyses.createIndex({ cvUploadId: 1 });

// ============================================================================
// 7. CV ANALYSIS SKILLS - Kỹ năng trích xuất từ CV
// ============================================================================
db.createCollection("cvAnalysisSkills", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "analysisId", "skillId", "source"],
      properties: {
        _id:        { bsonType: "string" },
        analysisId: { bsonType: "string" },
        skillId:    { bsonType: "string" },
        source:     { bsonType: "string", enum: ["CV", "JD", "MISSING"] }
      }
    }
  }
});

db.cvAnalysisSkills.createIndex({ analysisId: 1, source: 1 });
db.cvAnalysisSkills.createIndex({ analysisId: 1, skillId: 1, source: 1 }, { unique: true });

// ============================================================================
// 8. AI INSIGHTS - Điểm mạnh/yếu từ Gemini AI
// ============================================================================
db.createCollection("aiInsights", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "analysisId", "insightType", "content"],
      properties: {
        _id:         { bsonType: "string" },
        analysisId:  { bsonType: "string" },
        insightType: { bsonType: "string", enum: ["STRENGTH", "WEAKNESS"] },
        content:     { bsonType: "string", maxLength: 1000 },
        sortOrder:   { bsonType: "int" }
      }
    }
  }
});

db.aiInsights.createIndex({ analysisId: 1, insightType: 1 });

// ============================================================================
// 9. AI SUGGESTIONS - Gợi ý cải thiện kỹ năng
// ============================================================================
db.createCollection("aiSuggestions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "analysisId", "skillName", "reason"],
      properties: {
        _id:        { bsonType: "string" },
        analysisId: { bsonType: "string" },
        skillName:  { bsonType: "string", maxLength: 100 },
        reason:     { bsonType: "string", maxLength: 1000 },
        sortOrder:  { bsonType: "int" }
      }
    }
  }
});

db.aiSuggestions.createIndex({ analysisId: 1 });

// ============================================================================
// 10. LEARNING RESOURCES - Tài nguyên học tập
// ============================================================================
db.createCollection("learningResources", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "suggestionId", "name", "url", "platform"],
      properties: {
        _id:          { bsonType: "string" },
        suggestionId: { bsonType: "string" },
        name:         { bsonType: "string", maxLength: 300 },
        url:          { bsonType: "string", maxLength: 500 },
        resourceType: { bsonType: "string", enum: ["free", "paid"] },
        platform:     { bsonType: "string", enum: ["Roadmap.sh", "FreeCodeCamp", "Udemy", "YouTube", "Other"] },
        sortOrder:    { bsonType: "int" }
      }
    }
  }
});

db.learningResources.createIndex({ suggestionId: 1 });

// ============================================================================
// 11. PRICING PLANS - Gói dịch vụ
// ============================================================================
db.createCollection("pricingPlans", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "name", "priceMonthly", "maxMembers"],
      properties: {
        _id:          { bsonType: "string" },
        name:         { bsonType: "string" },
        priceMonthly: { bsonType: "double" },
        priceYearly:  { bsonType: ["double", "null"] },
        currency:     { bsonType: "string" },
        description:  { bsonType: ["string", "null"] },
        maxMembers:   { bsonType: "int" },
        isPopular:    { bsonType: "bool" },
        isActive:     { bsonType: "bool" },
        sortOrder:    { bsonType: "int" },
        createdAt:    { bsonType: "date" }
      }
    }
  }
});

db.pricingPlans.createIndex({ name: 1 }, { unique: true });

// Seed pricing plans
db.pricingPlans.insertMany([
  {
    _id: "pp001", name: "Starter", priceMonthly: 0.00, priceYearly: null,
    currency: "USD", description: "Perfect for students and first-time job seekers.",
    maxMembers: 1, isPopular: false, isActive: true, sortOrder: 1,
    createdAt: new Date()
  },
  {
    _id: "pp002", name: "Pro", priceMonthly: 19.00, priceYearly: 190.00,
    currency: "USD", description: "Best for active applicants who want faster results.",
    maxMembers: 1, isPopular: true, isActive: true, sortOrder: 2,
    createdAt: new Date()
  },
  {
    _id: "pp003", name: "Team", priceMonthly: 79.00, priceYearly: 790.00,
    currency: "USD", description: "Great for coaches, campus teams, and organizations.",
    maxMembers: 20, isPopular: false, isActive: true, sortOrder: 3,
    createdAt: new Date()
  }
]);

// ============================================================================
// 12. PLAN FEATURES - Tính năng theo từng plan
// ============================================================================
db.createCollection("planFeatures", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "planId", "feature"],
      properties: {
        _id:       { bsonType: "string" },
        planId:    { bsonType: "string" },
        feature:   { bsonType: "string", maxLength: 200 },
        sortOrder: { bsonType: "int" }
      }
    }
  }
});

db.planFeatures.createIndex({ planId: 1 });

// Seed plan features
db.planFeatures.insertMany([
  // Starter
  { _id: "pf001", planId: "pp001", feature: "1 resume template",         sortOrder: 1 },
  { _id: "pf002", planId: "pp001", feature: "Basic ATS check",           sortOrder: 2 },
  { _id: "pf003", planId: "pp001", feature: "Standard download",         sortOrder: 3 },
  { _id: "pf004", planId: "pp001", feature: "Email support",             sortOrder: 4 },
  // Pro
  { _id: "pf005", planId: "pp002", feature: "All premium templates",     sortOrder: 1 },
  { _id: "pf006", planId: "pp002", feature: "Advanced ATS optimization", sortOrder: 2 },
  { _id: "pf007", planId: "pp002", feature: "AI resume suggestions",     sortOrder: 3 },
  { _id: "pf008", planId: "pp002", feature: "Priority support",          sortOrder: 4 },
  // Team
  { _id: "pf009", planId: "pp003", feature: "Up to 20 members",          sortOrder: 1 },
  { _id: "pf010", planId: "pp003", feature: "Shared template library",   sortOrder: 2 },
  { _id: "pf011", planId: "pp003", feature: "Usage analytics",           sortOrder: 3 },
  { _id: "pf012", planId: "pp003", feature: "Dedicated onboarding",      sortOrder: 4 }
]);

// ============================================================================
// 13. USER SUBSCRIPTIONS - Đăng ký gói dịch vụ
// ============================================================================
db.createCollection("userSubscriptions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "userId", "planId", "billingCycle", "status", "startDate"],
      properties: {
        _id:          { bsonType: "string" },
        userId:       { bsonType: "string" },
        planId:       { bsonType: "string" },
        billingCycle: { bsonType: "string", enum: ["monthly", "yearly"] },
        status:       { bsonType: "string", enum: ["active", "cancelled", "expired", "past_due"] },
        startDate:    { bsonType: "date" },
        endDate:      { bsonType: ["date", "null"] },
        cancelledAt:  { bsonType: ["date", "null"] },
        createdAt:    { bsonType: "date" }
      }
    }
  }
});

db.userSubscriptions.createIndex({ userId: 1, status: 1 });

// ============================================================================
// 14. TEAM MEMBERS - Thành viên nhóm (cho plan Team)
// ============================================================================
db.createCollection("teamMembers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "subscriptionId", "userId", "role"],
      properties: {
        _id:            { bsonType: "string" },
        subscriptionId: { bsonType: "string" },
        userId:         { bsonType: "string" },
        role:           { bsonType: "string", enum: ["owner", "admin", "member"] },
        joinedAt:       { bsonType: "date" }
      }
    }
  }
});

db.teamMembers.createIndex({ subscriptionId: 1, userId: 1 }, { unique: true });

// ============================================================================
// 15. REDDIT CACHE - Cache proxy cho Reddit API (5-minute TTL)
// ============================================================================
db.createCollection("redditCache", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "cacheKey", "responseBody", "cachedAt", "expiresAt"],
      properties: {
        _id:          { bsonType: "string" },
        cacheKey:     { bsonType: "string", maxLength: 500 },
        responseBody: { bsonType: "string" },
        cachedAt:     { bsonType: "date" },
        expiresAt:    { bsonType: "date" }
      }
    }
  }
});

db.redditCache.createIndex({ cacheKey: 1 }, { unique: true });
// TTL index: MongoDB tự động xóa documents khi expiresAt đã qua
db.redditCache.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============================================================================
// 16. AUDIT LOGS - Nhật ký hoạt động người dùng
// ============================================================================
db.createCollection("auditLogs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "action"],
      properties: {
        _id:        { bsonType: "string" },
        userId:     { bsonType: ["string", "null"] },
        action:     { bsonType: "string", maxLength: 100 },
        entityType: { bsonType: ["string", "null"] },
        entityId:   { bsonType: ["string", "null"] },
        details:    { bsonType: ["string", "null"] },
        ipAddress:  { bsonType: ["string", "null"], maxLength: 45 },
        userAgent:  { bsonType: ["string", "null"], maxLength: 500 },
        createdAt:  { bsonType: "date" }
      }
    }
  }
});

db.auditLogs.createIndex({ userId: 1, createdAt: -1 });
db.auditLogs.createIndex({ action: 1, createdAt: -1 });

// ============================================================================
// DONE
// ============================================================================
print("✅ HireWiseDB MongoDB initialized successfully!");
print("   - 16 collections created with validators");
print("   - Indexes created (including TTL for redditCache)");
print("   - Seed data inserted: 12 templates, 77 skills, 3 plans, 12 features");