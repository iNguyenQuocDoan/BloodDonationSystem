const CreateSlotPage = () => {
    return (
        <>
            <div className=" bg-[#f5f5f5] py-8 px-2 flex justify-center">
                <div className="container max-w-xl mx-auto">
                    <h1 className="text-2xl md:text-3xl text-[#D32F2F] text-center mb-6">Tạo ca hiến máu mới</h1>
                    <div className="w-full">
                        <div className="bg-white rounded-lg shadow-sm border text-sm">
                            <form className="p-6 space-y-4">
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Ngày</label>
                                    <input 
                                    type="date" 
                                    name="date" 
                                    className="w-full px-3 py-2 border rounded" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Giờ bắt đầu</label>
                                    <input type="time" name="time-start" className="w-full px-3 py-2 border rounded" />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Giờ kết thúc</label>
                                    <input type="time" name="time-end" className="w-full px-3 py-2 border rounded" />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Sức chứa</label>
                                    <input type="number" min={1} max={100} name="volume" value={100} className="w-full px-3 py-2 border rounded"/>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Địa điểm</label>
                                    <input type="text" name="address" className="w-full px-3 py-2 border rounded"/>
                                </div>
                                <button className="bg-[#D32F2F] p-[0.4rem] rounded-md text-white px-[1.2rem]">Tạo ca hiến máu</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default CreateSlotPage;