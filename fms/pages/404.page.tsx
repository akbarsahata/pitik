import Button from "@components/atoms/Button/Button";
import NotFound from "@illustrations/NotFound.svg";
import Head from "next/head";
import { useRouter } from "next/router";

const Page404 = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Not Found | FMS Pitik</title>
      </Head>
      <div className="mt-16 flex flex-col items-center justify-center">
        <NotFound className="w-64 h-32" />
        <p className="mt-2 mb-10">
          Oops, our farmer can&apos;t find their chickens.
        </p>
        <Button
          title="Back to Dashboard"
          size="xs"
          onClick={() => router.push("/")}
        />
      </div>
    </>
  );
};

export default Page404;
