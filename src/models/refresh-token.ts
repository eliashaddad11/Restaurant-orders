import { model, Schema} from 'mongoose';

const rtSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    createdByIp: String,
    revoked: Date,
    revokedByIp: String,
    replacedByToken: String
});
    
rtSchema.virtual('isExpired').get(function (this:any) {
    return Date.now() >= this.expires;
});

rtSchema.virtual('isActive').get(function (this:any) {
    return !this.revoked && !this.isExpired;
});

rtSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.id;
        delete ret.user;}
});

const RefreshToken = model('RefreshToken', rtSchema);
  
export default RefreshToken;
  