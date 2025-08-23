export interface AdminDashboardActivity {
    type: string
    actorName: string
    action: string
    target: string
    timestamp: string
  }
  
  export interface AdminDashboardTimelineEntry {
    date: string
    activities: AdminDashboardActivity[]
  }
  
  export interface AdminDashboardTimelineResponse {
    data: AdminDashboardTimelineEntry[]
    success: boolean
    message: string
    errors?: any
  }
  
  export interface AdminDashboardTimelineRequest {
    pageNumber: number
    pageSize: number
  }