export default function About() {
    return (
        <div className="py-10">
            <div id="about" className="bg-slate-200 container mx-auto p-10 sm:py-10 lg:py-20 rounded-md shadow-md">
                <div className="gap-10 flex flex-col md:flex-row items-center justify-center">
                    <div className="text-pretty text-base font-medium text-gray-500 sm:text-xl">
                        <p className="text-md font-semibold tracking-tight sm:text-xl">
                            Hi there, I am
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight text-teal-600 sm:text-4xl">
                            Kathy Dang
                        </h1>

                        <p className="mt-8">
                            Welcome to my blog, where I share my personal insights and experiences gained during my journey as a Full Stack engineer.
                        </p>
                        <div className="mt-10 items-center">
                            <a
                                href="https://kathydang-porfolio.vercel.app/" target='blank' rel="noopener noreferrer"
                                className="animated-border rounded-md bg-teal-600 px-3.5 py-2.5 text-xl font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Visit my Portfolio
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}