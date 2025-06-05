import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      {/* Section 1 */}
      <div className="relative bg-[#000000] w-full h-[400px]">
        <div className=""></div>
        <img
          src="/image/DonateBloodBanner.jpg"
          alt="DaiVietBlood"
          className="object-cover w-full h-full opacity-35 relative"
        ></img>
        <div className="container mx-auto ">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="font-[700] text-white md:text-[39px] text-[30px] flex-1">
              Give a Drop of Blood — Restore Hope
            </h1>
            <p className="text-white md:text-[17px] text-[15px] mt-[10px]">
              DaiVietBlood connects blood donors with people in urgent need,
              providing a safe, simple, and reliable way to give back to the
              community. Through each donation, we aim to raise awareness and
              encourage a culture of compassion and shared responsibility.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="py-[24px]">
          <div className="">
            <p className="text-center text-[#D32F2F] py-[15.5px] bg-[#FFE6E6] border rounded-[10px]">
              We have recorded:{" "}
              <strong> 1,234 blood donors – bringing hope to 3,567s </strong>
              lives
            </p>
          </div>

          <div className="mt-[38px]">
            <h2 className="text-center text-[30px] text-[#D32F2F] font-[700]">
              Each drop of blood carries a spark of hope
            </h2>
            <p className="text-center text-[18px] mt-[25px]">
              Join hands to donate blood and save lives in the community.
            </p>
            <div className="flex justify-center">
              <button className="mx-auto text-white mt-[25px] px-[24px] py-[8px] rounded-[6px] bg-[#D32F2F]">
                <Link to="/donateBlood">Give a Drop of Life</Link>
              </button>
            </div>
          </div>

          <div className="mt-[45px] ">
            <div className="bg-[#f9f9f9] w-full py-[32px] px-[24px] rounded-md border-l-[6px] border-[#D32F2F] max-w-4xl mx-auto shadow-sm">
              <h3 className="text-[#D32F2F] text-[20px] font-semibold mb-[16px]">
                Fake stories. Real lives saved.
              </h3>
              <p className="text-gray-700 italic text-[16px] mb-[24px]">
                "BloodShare helped me get type O blood when I needed it most —
                and now I’ve completely recovered."
              </p>
              <p className="text-right text-gray-800 font-medium text-[15px]">
                – Nguyen Cong Minh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*End Section 1 */}

      <div className="container mx-auto mt-[48px]">
        <h4 className="text-[20px] text-[#D32F2F] text-center">
          Are You Eligible to Donate Blood?
        </h4>
        <div className="w-full h-full mt-[24px] py-[32px] px-[24px] bg-[#E57373] max-w-4xl mx-auto shadow-sm rounded-[7px] ">
          <h5 className="text-center text-white text-[20px] font-[500]">
            Eligibility Requirements
          </h5>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-x-[10px] h-full">
            <div className="text-white bg-[#D32F2F] w-full h-[172px] mt-[24px]  shadow-sm rounded-[15px]">
              <p className="mt-[20px] ml-[15px] xl:text-[16px] text-[12px]">
                Age & Weight :{" "}
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Age: From 18 to 60 years old.
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Weight: Females ≥ 45kg, Males ≥ 50kg.
              </p>
            </div>

            <div className="text-white bg-[#D32F2F] w-full h-[172px] mt-[24px]  shadow-sm rounded-[15px]">
              <p className="mt-[20px] ml-[15px] xl:text-[16px] text-[12px] ">
                {" "}
                Health Condition :{" "}
              </p>
              <p className="mt-[10px] ml-[15px] xl:text-[13px] text-[12px]">
                Must not have any blood-transmitted diseases.
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Stable blood pressure, no use of drugs or stimulants.
              </p>
            </div>

            <div className="text-white bg-[#D32F2F] w-full h-[172px] mt-[24px]  shadow-sm rounded-[15px]">
              <p className="mt-[20px] ml-[15px] xl:text-[16px] text-[12px] ">
                Donation Frequency :{" "}
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Females: Every 3 months.
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Males: Every 2 months.
              </p>
            </div>

            <div className="text-white bg-[#D32F2F] w-full h-[172px] mt-[24px]  shadow-sm rounded-[15px]">
              <p className="mt-[20px] ml-[15px] xl:text-[16px] text-[12px]">
                Women’s Health Requirements :
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Must not be pregnant or on their menstrual period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Homepage;
