import Button from "@components/atoms/Button/Button";
import Forbidden from "@illustrations/Forbidden.svg";
import Head from "next/head";
import { useRouter } from "next/router";

const Page403 = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Forbidden | FMS Pitik</title>
      </Head>
      <div className="mt-16 flex flex-col items-center justify-center">
        <Forbidden className="w-64 h-32" />
        <p className="mt-2 mb-10">
          Oops, apparently you can&apos;t enter this farm.
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

export default Page403;
