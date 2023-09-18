export interface TermsSerResponse {
    status: number;
    data?: {
      _id: string;
      page_title: string;
      page_description: string;
      page_url: string;
      status: string;
      created_by: string;
      created_at: string;
      last_accessed_by: string;
      last_accessed_at: string;
    };
  }
  