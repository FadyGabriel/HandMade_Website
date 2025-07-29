export default function Search({ search, onSearchChange }) {
  return (
    <>
      <div className="flex justify-center pt-10 pb-17 ">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 absolute text-[#A78074]  right-3 top-1/2 -translate-y-1/2  "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            value={search}
            onChange={onSearchChange}
            type="text"
            className="sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[700px] h-10 rounded-lg pl-5 pr-10 bg-[#F5F5F1] text-[#A78074] border border-[#A78074] focus:border-[#A78074] focus:outline-none"
            placeholder="Search"
          />
        </div>
      </div>
    </>
  );
}
