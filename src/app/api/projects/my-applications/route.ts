import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { projects, studentProfiles, projectCollaborations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { NextResponse } from "next/server";

// Collaboration requests the signed-in student has sent out, used to mark
// project cards as "Applied" on the browse tab.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile] = await db
    .select()
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, session.user.id));

  if (!profile) {
    return NextResponse.json({ profileId: null, applications: [] });
  }

  // Owner profile, joined separately from the applicant's own profile row
  const owner = alias(studentProfiles, "owner");

  const applications = await db
    .select({
      id: projectCollaborations.id,
      projectId: projectCollaborations.projectId,
      domain: projectCollaborations.domain,
      message: projectCollaborations.message,
      status: projectCollaborations.status,
      appliedAt: projectCollaborations.appliedAt,
      project: {
        id: projects.id,
        title: projects.title,
        description: projects.description,
        githubUrl: projects.githubUrl,
        demoUrl: projects.demoUrl,
        tags: projects.tags,
        lookingForContributors: projects.lookingForContributors,
        contributorRoles: projects.contributorRoles,
        contributorDescription: projects.contributorDescription,
        status: projects.status,
        submittedAt: projects.submittedAt,
        submittedBy: projects.submittedBy,
        studentName: owner.name,
        department: owner.department,
      },
    })
    .from(projectCollaborations)
    .innerJoin(projects, eq(projectCollaborations.projectId, projects.id))
    .leftJoin(owner, eq(projects.submittedBy, owner.id))
    .where(eq(projectCollaborations.applicantId, profile.id))
    .orderBy(desc(projectCollaborations.appliedAt));

  // profileId lets the client tell which browse-tab projects it owns
  return NextResponse.json({ profileId: profile.id, applications });
}
