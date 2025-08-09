
// Type cho API my-progress
export interface StudentProgress {
	
	"Total LOC": string;
	
	Assignment: string;
	
	Ranking: string;
}

export interface StudentProgressResponse {
	"Total LOC": string;
	Assignment: string;
	Ranking: string;
}

// Type cho API user profile
export interface StudentProfile {
	name: string;
	email: string;
	role: string;
	studentCode: string;
	major: string;
	dateOfBirth: string;
	phone: string;
	gender: string;
	address: string;
}

export interface StudentProfileResponse {
	name: string;
	email: string;
	role: string;
	studentCode: string;
	major: string;
	dateOfBirth: string;
	phone: string;
	gender: string;
	address: string;
    
}
