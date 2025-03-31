export interface CodeValidationAttributes {
    id?: string; 
    user_id: string;
    code: string;
    expires_at: Date;
    created_at?: Date;
    updated_at?: Date;
  }