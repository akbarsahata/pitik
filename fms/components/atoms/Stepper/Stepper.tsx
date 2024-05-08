import { TStepperItem, TStepperType } from "./Stepper.type";

export const Stepper = ({ data }: TStepperType) => {
  return (
    <div>
      {data.map((item: TStepperItem, index) => (
        <div key={item.heading} className="flex flex-row">
          <div className="relative">
            {index !== data.length - 1 && (
              <div className="border-gray-200 translate-y-1/2 left-7 -top-1/2 h-full border-2 absolute"></div>
            )}
            <div className="px-4 relative">
              {index === data.length - 1 ? (
                <div className="bg-green-200 rounded-full p-1.5">
                  <div className="bg-green-400 w-4 h-4 rounded-full"></div>
                </div>
              ) : (
                <div className="bg-gray-200 rounded-full p-1.5">
                  <div className="bg-gray-400 w-4 h-4 rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 pb-4">
            <p className="text-base font-medium ">{item.heading}</p>
            <p className="text-gray-600 font-light text-sm">
              {item.subheading}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
