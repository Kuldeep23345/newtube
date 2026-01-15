'use client';
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserPageBanner } from "../components/user-page-banner";
import { UserPageInfo } from "../components/user-page-info";

interface UserSectionProps {
  userId: string;
}

export const UserSection = ({ userId }: UserSectionProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <UserSectionSupense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UserSectionSupense = ({ userId }: UserSectionProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });
  return <div className="flex flex-col">
    <UserPageBanner user={user}/>
    <UserPageInfo user={user}/>
  </div>;
};
