import { prop, getModelForClass } from '@typegoose/typegoose';

class Community {
    @prop({ required: true })
    public name?: string;

    @prop()
    public logo?: string;

    public static getModel() {
        return CommunityModel;
    }
}

const CommunityModel = getModelForClass(Community);

export { CommunityModel, Community };
