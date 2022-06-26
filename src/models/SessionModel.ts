import  mongoose, { Schema, Document } from 'mongoose'

export interface iSession extends Document {
  user: Schema.Types.ObjectId,
  valid: boolean
}

const sessionSchema = new Schema<iSession>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  valid: {type: Boolean, default: true}
}, {
  timestamps: true
})

const SessionModel = mongoose.model<iSession>('Session', sessionSchema)
export default SessionModel
