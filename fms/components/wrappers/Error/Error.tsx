import Button from "@components/atoms/Button/Button";
import ArrowRightIcon from "@icons/ArrowRightIcon.svg";
import Head from "next/head";
import { NextRouter } from "next/router";

const Error = ({ router }: { router: NextRouter }) => {
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <>
      <Head>
        <title>FMS is Having a Problem...</title>
      </Head>

      <main>
        <div className="max-w-5xl mx-12 lg:mx-auto mt-24 mb-36">
          <div>
            <p className="font-semibold text-orange-700">Error</p>
            <p className="text-6xl font-medium mt-2">There&apos;s a problem</p>
            <p className="text-gray-700 text-lg font-light mt-4">
              Sorry, it looks like our farmers are busy fighting alien attacks
              right now.
            </p>
          </div>
          <div className="mt-8 flex flex-row space-x-4">
            <Button
              leadIcon={<ArrowRightIcon className="rotate-180" />}
              size="sm"
              title="Back to Dashboard"
              onClick={() => router.push("/")}
            />
            <Button
              type="outline"
              size="sm"
              title="Reload Page"
              onClick={refreshPage}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Error;
