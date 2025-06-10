const AboutUs = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-screen py-6 px-2">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6 md:p-8">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#D32F2F] mb-8">
          About Us
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold text-[#D32F2F] mb-1">Our Mission</h3>
          <p className="text-gray-700 text-sm md:text-base">
            BloodShare is committed to connecting blood donors and recipients, providing safe, transparent, and humane solutions to save community lives.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-[#D32F2F] mb-1">Our Vision</h3>
          <p className="text-gray-700 text-sm md:text-base">
            To become Vietnam's leading blood donation platform, where every drop of blood given brings hope to patients and their families.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-[#D32F2F] mb-1">Core Values</h3>
          <ul className="text-gray-700 text-sm md:text-base list-none pl-0 space-y-1">
            <li>
              <span className="font-bold text-black">Compassion:</span> Sharing love and helping those in difficult circumstances.
            </li>
            <li>
              <span className="font-bold text-black">Safety:</span> Strictly following medical procedures to protect community health.
            </li>
            <li>
              <span className="font-bold text-black">Transparency:</span> All information and activities are public and verifiable.
            </li>
            <li>
              <span className="font-bold text-black">Solidarity:</span> Connecting volunteers, organizations, and individuals to spread good deeds together.
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-[#D32F2F] mb-3">Our Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#fafbfc] rounded-lg shadow p-4 flex flex-col items-center">
              <span className="font-bold text-[#D32F2F]">Nguyen Thi A</span>
              <span className="text-gray-700 text-xs md:text-sm mt-1">Chief Executive Officer</span>
            </div>
            <div className="bg-[#fafbfc] rounded-lg shadow p-4 flex flex-col items-center">
              <span className="font-bold text-[#D32F2F]">Tran Van B</span>
              <span className="text-gray-700 text-xs md:text-sm mt-1">Head of Medical Department</span>
            </div>
            <div className="bg-[#fafbfc] rounded-lg shadow p-4 flex flex-col items-center">
              <span className="font-bold text-[#D32F2F]">Pham Thi C</span>
              <span className="text-gray-700 text-xs md:text-sm mt-1">Media Manager</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[#D32F2F] mb-1">Partners & Collaborators</h3>
          <p className="text-gray-700 text-sm md:text-base mb-2">
            We are proud to collaborate with hospitals, medical organizations, and volunteer communities to expand the blood donation network:
          </p>
          <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base space-y-1">
            <li>Hospital A</li>
            <li>Hospital B</li>
            <li>Medical Organization C</li>
            <li>Volunteer Club D</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;