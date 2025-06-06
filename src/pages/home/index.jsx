import { useState } from "react";
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

      {/* Section 2 */}
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

      {/* End Section 2 */}
      {/*  Section 3 */}
      <div className="container mx-auto mt-[48px]">
        <h4 className="text-[20px] text-[#D32F2F] text-center mb-[24px]">
          Compatible Blood Types
        </h4>

        <div className="container mx-auto px-4 mt-[48px]">
          <h4 className="text-[24px] text-[#D32F2F] text-center font-semibold mb-[16px]">
            Blood Type Compatibility
          </h4>

          <div className="bg-white rounded-[5px] shadow-md overflow-x-auto max-w-4xl mx-auto">
            <table className="min-w-full text-sm text-center border-collapse">
              <thead className="bg-[#FAFAFA] border-b">
                <tr>
                  <th className="px-6 py-4 text-[#D32F2F] font-semibold">
                    Blood Type
                  </th>
                  <th className="px-6 py-4 text-[#D32F2F] font-semibold">
                    Can Donate To
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-3 font-medium">O</td>
                  <td className="px-6 py-3">
                    O, A, B, AB <br />
                    <span className="text-gray-500 text-xs">
                      (Universal Donor)
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b">
                  <td className="px-6 py-3 font-medium">A</td>
                  <td className="px-6 py-3">A, AB</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-medium">B</td>
                  <td className="px-6 py-3">B, AB</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-3 font-medium">AB</td>
                  <td className="px-6 py-3">
                    AB <br />
                    <span className="text-gray-500 text-xs">
                      (Universal Recipient)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End Section 3 */}
      {/* Section 4 */}
      <div className="py-[48px]">
        <div className="container mx-auto ">
          <h4 className="text-[20px] text-[#D32F2F] text-center mb-[24px] ">
            Blood Donation for Humanity
          </h4>
          <div className="flex justify-center items-center">
            <div className="grid md:grid-cols-4 grid-cols-2 gap-x-[20px] ">
              <div className="max-w-screen-xl   sm:h-[160px] h-[130px] sm:w-[270px] w-[180px]">
                <img
                  src="/image/Gruop.png"
                  alt="DaiVietBlood"
                  className="object-fit w-full h-full border rounded-[5px]"
                ></img>
              </div>
              <div className="max-w-screen-xl  sm:h-[160px] h-[130px] sm:w-[270px] w-[180px]">
                <img
                  src="/image/mobile.png "
                  alt="DaiVietBlood"
                  className="object-fit w-full h-full border rounded-[5px]"
                ></img>
              </div>
              <div className="max-w-screen-xl  sm:h-[160px] h-[130px] sm:w-[270px] w-[180px]">
                <img
                  src="/image/emergency.png "
                  alt="DaiVietBlood"
                  className="object-fit w-full h-full border rounded-[5px]"
                ></img>
              </div>
              <div className="max-w-screen-xl   sm:h-[160px] h-[130px] sm:w-[270px] w-[180px]">
                <img
                  src="/image/thanks.png "
                  alt="DaiVietBlood"
                  className="object-fit w-full h-full border rounded-[5px]"
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 4 */}
      <h2 className="text-center hover:underline text-[#D32F2F] mb-[20px]">
        <Link to="/faq">FAQ</Link>
      </h2>
    </>
  );
};
export default Homepage;
