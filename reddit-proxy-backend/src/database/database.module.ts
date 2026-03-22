import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from './schemas/user.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { CvUpload, CvUploadSchema } from './schemas/cv-upload.schema';
import {
  CvAnalysis,
  CvAnalysisSchema,
  CvAnalysisSkill,
  CvAnalysisSkillSchema,
  AiInsight,
  AiInsightSchema,
  AiSuggestion,
  AiSuggestionSchema,
  LearningResource,
  LearningResourceSchema,
} from './schemas/cv-analysis.schema';
import {
  ResumeTemplate,
  ResumeTemplateSchema,
  Skill,
  SkillSchema,
} from './schemas/template-skill.schema';
import {
  PricingPlan,
  PricingPlanSchema,
  PlanFeature,
  PlanFeatureSchema,
  UserSubscription,
  UserSubscriptionSchema,
  TeamMember,
  TeamMemberSchema,
} from './schemas/subscription.schema';
import {
  RedditCache,
  RedditCacheSchema,
  AuditLog,
  AuditLogSchema,
} from './schemas/misc.schema';
import {
  ResumeDataModel,
  ResumeDataSchema,
} from './schemas/resume-data.schema';
import {
  CandidateCv,
  CandidateCvSchema,
  BatchAnalysis,
  BatchAnalysisSchema,
  DuplicatePair,
  DuplicatePairSchema,
} from './schemas/candidate-cv.schema';

export const ALL_SCHEMAS = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: RefreshToken.name, schema: RefreshTokenSchema },
  { name: CvUpload.name, schema: CvUploadSchema },
  { name: CvAnalysis.name, schema: CvAnalysisSchema },
  { name: CvAnalysisSkill.name, schema: CvAnalysisSkillSchema },
  { name: AiInsight.name, schema: AiInsightSchema },
  { name: AiSuggestion.name, schema: AiSuggestionSchema },
  { name: LearningResource.name, schema: LearningResourceSchema },
  { name: ResumeTemplate.name, schema: ResumeTemplateSchema },
  { name: Skill.name, schema: SkillSchema },
  { name: PricingPlan.name, schema: PricingPlanSchema },
  { name: PlanFeature.name, schema: PlanFeatureSchema },
  { name: UserSubscription.name, schema: UserSubscriptionSchema },
  { name: TeamMember.name, schema: TeamMemberSchema },
  { name: RedditCache.name, schema: RedditCacheSchema },
  { name: AuditLog.name, schema: AuditLogSchema },
  { name: ResumeDataModel.name, schema: ResumeDataSchema },
  { name: CandidateCv.name, schema: CandidateCvSchema },
  { name: BatchAnalysis.name, schema: BatchAnalysisSchema },
  { name: DuplicatePair.name, schema: DuplicatePairSchema },
]);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
  const uri = config.get<string>('MONGODB_URI');
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables!');
  }
  return { uri };
},
    }),
    ALL_SCHEMAS,
  ],
  exports: [ALL_SCHEMAS],
})
export class DatabaseModule {}
