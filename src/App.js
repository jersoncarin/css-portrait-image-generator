import { useEffect, useRef, useState } from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    Navigate
} from "react-router-dom"

var globalState = {
    text: '',
    greyScale: '100%',
    image: '',
    fontSize: 10,
    lineHeight: 0.8
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/preview" element={<Preview />} />
                <Route path='*' element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

const Main = () => {

    const [buttonDisable, setButtonDisable] = useState(true)
    const [image, setImage] = useState({
        hasImage: false,
        name: null,
        string: ''
    })
    const [generating, setGenerating] = useState(false)
    const [text, setText] = useState('')
    const [hasAreaText, setHasAreaText] = useState(false)
    const [greyScale, setGreyScale] = useState(100)
    const [fontSize, setFontSize] = useState(8)
    const [lineHeight, setLineHeight] = useState(0.8)
    const renderArea = useRef(null)
    const navigate = useNavigate()
    const configRef = useRef(null)
    const [height, setHeight] = useState('100%')
    const [resetting,setResetting] = useState(false)

    const onImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            const reader = new FileReader()

            reader.addEventListener('load', (e) => {
                setImage({
                    hasImage: true,
                    name: file.name,
                    string: e.target.result
                })
            })

            reader.readAsDataURL(file)
        }
    }

    const onGenerate = (e) => {
        if (buttonDisable) {
            return
        }

        setGenerating(true)
        setButtonDisable(true)
        setHasAreaText(true)

        if (renderArea) {
            const timeout = setInterval(() => {
                const area = document.getElementById('area')
                const parentAreaHeight = renderArea.current.offsetHeight

                if (area.scrollHeight <= parentAreaHeight) {
                    // Append the text
                    area.innerHTML += text
                } else {
                    clearInterval(timeout)
                    setGenerating(false)
                    setButtonDisable(false)
                }

            }, 1)

            if (!generating) {
                document.getElementById('area').innerHTML = ''
            }
        }
    }

    const onReset = () => {
        if(resetting || buttonDisable || !hasAreaText) {
            return
        }

        setButtonDisable(true)
        setResetting(true)

        setTimeout(() => {
            setLineHeight(0.8)
            setFontSize(8)
            setGreyScale(100)
            
            setButtonDisable(false)
            setResetting(false)
        },1000)
    }

    const handlePreview = () => {
        if (generating || buttonDisable || text.length === 0) {
            return
        }

        // Set global state to handle the preview
        globalState.text = text
        globalState.greyScale = greyScale
        globalState.image = image.string
        globalState.fontSize = parseInt(fontSize) + 2
        globalState.lineHeight = lineHeight

        navigate('/preview')
    }

    useEffect(() => {
        if (configRef.current !== null) {
            const height = configRef.current.offsetHeight

            setHeight(`${height}px`)
        }
    }, [])

    useEffect(() => {
        setButtonDisable(text === '' || !image.hasImage || image.name === null)
        setHasAreaText(false)
    }, [text, image.hasImage, image.name])

    const onAuthorClick = () => {
        window.location.href = 'https://jersoncarin.net'
    }

    return (
        <div className="w-full bg-gray-800 min-h-screen">
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                <div className="text-center pb-12">
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-white" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        CSS Portrait Image Generator 🔥
                    </h1>
                    <h2 className="text-base font-bold text-indigo-600 mt-2" onClick={onAuthorClick} style={{ cursor: 'pointer' }}>
                        Made with ❤️ by Jerson Carin
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <div className="w-full bg-gray-900 rounded-lg sahdow-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="w-full md:w-3/5 text-left p-6 md:p-4 space-y-2" ref={configRef}>
                            <div className="text-white text-xl font-bold">
                                <div className="m-1">
                                    <label className="inline-block mb-2 text-gray-100">
                                        Upload your Image(jpg,png,jpeg)
                                    </label>
                                    <div
                                        className="flex items-center justify-center w-full mb-4"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <label
                                            className="flex flex-col w-full h-32 border-2 border hover:bg-gray-800 hover:border-gray-300 rounded opacity-30"
                                            style={{
                                                opacity: generating ? '0.3' : '1',
                                                pointerEvents: generating ? 'none' : 'all'
                                            }}>
                                            <div className="flex flex-col items-center justify-center pt-7">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                                    {image.hasImage ? image.name : 'Select a photo'}
                                                </p>
                                            </div>
                                            <input type="file" className="opacity-0" onChange={onImageChange} accept="image/png, image/jpeg" />
                                        </label>
                                    </div>
                                    <label className="inline-block mb-2 text-gray-100">
                                        Enter text you want to display
                                    </label>
                                    <textarea
                                        className="w-full h-44 px-3 py-2 bg-gray-900 text-base text-white placeholder-gray-400 border focus:outline-none rounded scrollbar scrollbar-thumb-gray-800 scrollbar-track-gray-900 scrollbar-thin"
                                        placeholder="Type or paste text or song lyrics here, also you can put small length text, generator will automatically fill the content by it's width and height."
                                        onChange={(e) => setText(e.target.value)}
                                        value={text}
                                        spellCheck={false}
                                        style={{
                                            resize: "none",
                                            opacity: generating ? '0.3' : '1',
                                            pointerEvents: generating ? 'none' : 'all'
                                        }}
                                    ></textarea>
                                    <div className="flex flex-col">
                                        <label className="flex flex-col mt-3">
                                            <span className="text-gray-100 mb-2">Greyscale filter ({greyScale}%)</span>
                                            <input
                                                className="rounded-lg overflow-hidden appearance-none bg-gray-700 h-4 w-128" onChange={(e) => setGreyScale(e.target.value)} type="range"
                                                min={1}
                                                max={100}
                                                step={1}
                                                value={greyScale}
                                                style={{
                                                    opacity: generating || !hasAreaText ? '0.3' : '1',
                                                    pointerEvents: generating || !hasAreaText ? 'none' : 'all'
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="flex flex-col mt-3">
                                            <span className="text-gray-100 mb-2">Font size ({fontSize}px)</span>
                                            <input
                                                className="rounded-lg overflow-hidden appearance-none bg-gray-700 h-4 w-128" onChange={(e) => setFontSize(e.target.value)} type="range"
                                                min={1}
                                                max={100}
                                                step={1}
                                                value={fontSize}
                                                style={{
                                                    opacity: generating || !hasAreaText ? '0.3' : '1',
                                                    pointerEvents: generating || !hasAreaText ? 'none' : 'all'
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="flex flex-col mt-3">
                                            <span className="text-gray-100 mb-2">Line height ({lineHeight})</span>
                                            <input
                                                className="rounded-lg overflow-hidden appearance-none bg-gray-700 h-4 w-128" onChange={(e) => setLineHeight(e.target.value)} type="range"
                                                min={-10}
                                                max={10}
                                                step={0.1}
                                                value={lineHeight}
                                                style={{
                                                    opacity: generating || !hasAreaText ? '0.3' : '1',
                                                    pointerEvents: generating || !hasAreaText ? 'none' : 'all'
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row">
                                        <button
                                            type="button"
                                            className="px-4 py-3 bg-indigo-600 rounded text-white outline-none w-full mt-4 flex flex-row items-center justify-center font-bold disabled:opacity-50 mr-2"
                                            disabled={buttonDisable}
                                            onClick={onGenerate}
                                        >
                                            {generating ?
                                                <i className="fas fa-cog fa-spin"></i>
                                                :
                                                <i className="fas fa-cog"></i>
                                            }
                                            <span className="ml-2">{generating ? 'Generating' : 'Generate'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-3 bg-red-700 rounded text-white outline-none w-full mt-4 flex flex-row items-center justify-center font-bold disabled:opacity-50"
                                            disabled={buttonDisable || !hasAreaText}
                                            onClick={onReset}
                                        >
                                            {resetting ?
                                                <i className="fas fa-sync fa-spin"></i>
                                                :
                                                <i className="fas fa-sync"></i>
                                            }
                                            <span className="ml-2">{resetting ? 'Resetting' : 'Reset'}</span>
                                        </button>
                                    </div>
                                    <span className="mt-2 text-gray-400 text-sm font-normal">Quick tip: Tap the preview image to view the full image.</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/5 renderArea relative" style={{ height, cursor: 'pointer' }} ref={renderArea} onClick={handlePreview}>
                            {image.hasImage && text.length !== 0 ?
                                <>
                                    <p id="area" style={{
                                        backgroundImage: `url(${image.string})`,
                                        filter: `grayscale(${greyScale}%)`,
                                        WebkitFilter: `grayscale(${greyScale}%)`,
                                        display: hasAreaText ? 'block' : 'none',
                                        visibility: generating ? 'hidden' : 'visible',
                                        fontSize: `${fontSize}px`,
                                        lineHeight: `${lineHeight}`
                                    }}></p>
                                    <div
                                        className="text-white m-auto font-bold text-xl"
                                        style={{
                                            display: hasAreaText ? 'none' : (generating ? 'none' : 'block')
                                        }}
                                    >Press generate button.</div>
                                    <div
                                        className="text-white absolute inset-y-1/2"
                                        style={{
                                            display: generating ? 'block' : 'none'
                                        }}
                                    >
                                        <i className="fas fa-spinner fa-spin  fa-5x"></i>
                                    </div>
                                </>
                                :
                                <div className="text-white m-auto font-bold text-xl">No Image and Text found.</div>
                            }

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

const Preview = () => {
    const renderPreview = useRef(null)
    const pageText = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (globalState.text === '') {
            navigate('/')
        }

        const timeout = setInterval(() => {
            if (renderPreview.current && pageText.current) {
                const area = pageText.current
                const parentAreaHeight = renderPreview.current.offsetHeight

                if (area.scrollHeight <= parentAreaHeight) {
                    // Append the text
                    area.innerHTML += globalState.text
                } else {
                    clearInterval(timeout)
                }

            } else {
                clearInterval(timeout)
            }
        }, 1)

    }, [navigate])

    return (
        <div className="renderPreview" ref={renderPreview}>
            <p ref={pageText} style={{
                backgroundImage: `url(${globalState.image})`,
                filter: `grayscale(${globalState.greyScale}%)`,
                WebkitFilter: `grayscale(${globalState.greyScale}%)`,
                fontSize: `${globalState.fontSize}px`,
                lineHeight: `${globalState.lineHeight}`
            }}>
            </p>
        </div>
    )
}

export default App;
