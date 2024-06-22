import { prop, getModelForClass, Ref, DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Community } from './Community'; // Import the CommunityModel

class User {
    @prop({ required: true })
    public email?: string;

    @prop({ required: true, select: false })
    public passwordHash?: string;

    @prop()
    public profilePicture?: string;

    @prop({ required: true, select: false, default: [] })
    public experiencePoints?: { points: number, timestamp: Date }[];

    @prop({ ref: () => Community, required: false })
    public community?: Ref<Community> | null;
}

const UserModel = getModelForClass(User);

export { UserModel, User };
