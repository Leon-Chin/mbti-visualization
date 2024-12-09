import personalityIcons from "./16PersonalitySVG"


const PersonalityImage = ({ width, height, type }) => {
    if (!personalityIcons[type.toLowerCase()]) {
        return <></>
    }
    return <img
        src={personalityIcons[type.toLowerCase()]} // 动态加载图标
        alt={type}
        style={{
            width: width,
            height: height,
            objectFit: 'contain', // 保持图标比例
        }}
    />
}

export default PersonalityImage