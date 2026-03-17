import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/* ─── Pricing Plan ────────────────────────────────────────────── */
export type PricingPlanDocument = PricingPlan & Document;

@Schema({ collection: 'pricingPlans', timestamps: false })
export class PricingPlan {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  priceMonthly: number;

  @Prop({ type: Number, default: null })
  priceYearly: number | null;

  @Prop({ default: 'USD', maxlength: 10 })
  currency: string;

  @Prop({ type: String, default: null, maxlength: 500 })
  description: string | null;

  @Prop({ required: true })
  maxMembers: number;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const PricingPlanSchema = SchemaFactory.createForClass(PricingPlan);

/* ─── Plan Feature ────────────────────────────────────────────── */
export type PlanFeatureDocument = PlanFeature & Document;

@Schema({ collection: 'planFeatures', timestamps: false })
export class PlanFeature {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true, maxlength: 200 })
  feature: string;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const PlanFeatureSchema = SchemaFactory.createForClass(PlanFeature);
PlanFeatureSchema.index({ planId: 1 });

/* ─── User Subscription ───────────────────────────────────────── */
export type UserSubscriptionDocument = UserSubscription & Document;

@Schema({ collection: 'userSubscriptions', timestamps: false })
export class UserSubscription {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true, enum: ['monthly', 'yearly'] })
  billingCycle: string;

  @Prop({
    required: true,
    enum: ['active', 'cancelled', 'expired', 'past_due'],
  })
  status: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ type: Date, default: null })
  endDate: Date | null;

  @Prop({ type: Date, default: null })
  cancelledAt: Date | null;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const UserSubscriptionSchema =
  SchemaFactory.createForClass(UserSubscription);
UserSubscriptionSchema.index({ userId: 1, status: 1 });

/* ─── Team Member ─────────────────────────────────────────────── */
export type TeamMemberDocument = TeamMember & Document;

@Schema({ collection: 'teamMembers', timestamps: false })
export class TeamMember {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  subscriptionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ['owner', 'admin', 'member'] })
  role: string;

  @Prop({ default: () => new Date() })
  joinedAt: Date;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
TeamMemberSchema.index({ subscriptionId: 1, userId: 1 }, { unique: true });
