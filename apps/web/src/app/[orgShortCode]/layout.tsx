'use client';

import Sidebar from './_components/sidebar';
import { GlobalStoreProvider } from '@/src/providers/global-store-provider';
import { buttonVariants } from '@/src/components/shadcn-ui/button';
import { SpinnerGap } from '@phosphor-icons/react';
import Link from 'next/link';
import { api } from '@/src/lib/trpc';

export default function Layout({
  children,
  params: { orgShortCode }
}: Readonly<{ children: React.ReactNode; params: { orgShortCode: string } }>) {
  const {
    data: storeData,
    isLoading: storeDataLoading,
    error: storeError
  } = api.org.store.getStoreData.useQuery({ orgShortCode });

  if (storeDataLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <SpinnerGap className=" text-sand-11 h-20 w-20 animate-spin" />
      </div>
    );
  }

  if (storeError && !storeDataLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-red-11 text-2xl font-bold">An Error Occurred!</h1>
        <span className="text-red-11 whitespace-pre font-mono text-xl">
          {storeError.message}
        </span>

        <Link
          className={buttonVariants({ variant: 'outline' })}
          href="/">
          Go Back Home
        </Link>
      </div>
    );
  }

  if (!storeDataLoading && !storeData?.currentOrg) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-red-11 text-2xl font-bold">Invalid Org</h1>

        <span className="whitespace-pre text-xl">
          Org with ShortCode{' '}
          <span className="font-mono underline">{orgShortCode}</span> either
          does not exists or you are not part of that org!
        </span>

        <Link
          className={buttonVariants({ variant: 'outline' })}
          href="/">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <GlobalStoreProvider initialState={storeData}>
      <div className="bg-sand-1 max-w-svh flex h-full max-h-svh w-full flex-row gap-0 overflow-hidden p-0">
        <div className="h-full max-h-full w-fit">
          <Sidebar />
        </div>
        <div className="flex h-full w-full flex-row p-0">{children}</div>
      </div>
    </GlobalStoreProvider>
  );
}
