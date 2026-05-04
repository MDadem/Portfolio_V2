
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        tokens: {
            fonts: {
                heading: { value: "'Syne', sans-serif" },
                body: { value: "'Space Grotesk', monospace" },
            },
            colors: {
                background: {
                    900: { value: '#050608' },
                    800: { value: '#0A0C12' },
                    700: { value: '#141821' },
                },
                neutral: {
                    50: { value: '#F5F5F5' },
                    100: { value: '#E5E5E5' },
                    200: { value: '#D4D4D4' },
                    300: { value: '#A3A3A3' },
                    400: { value: '#737373' },
                    500: { value: '#525252' },
                    600: { value: '#404040' },
                    700: { value: '#262626' },
                    800: { value: '#171717' },
                    900: { value: '#0A0A0A' },
                },
                primary: {
                    400: { value: '#8171FF' },
                    500: { value: '#6E5CFF' },
                    600: { value: '#5A4ADB' },
                },
                secondary: {
                    400: { value: '#B4FF40' },
                    500: { value: '#A3FF12' },
                    600: { value: '#8CE60F' },
                },
            },
        },
    },
    globalCss: {
        'html, body': {
            bg: '#050608',
            color: 'neutral.100',
            fontFamily: 'body',
            scrollBehavior: 'smooth',
        },
        '::-webkit-scrollbar': {
            width: '8px',
        },
        '::-webkit-scrollbar-track': {
            background: '#050608',
        },
        '::-webkit-scrollbar-thumb': {
            background: '#333',
            borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: '#6E5CFF',
        },
    },
})

export const system = createSystem(defaultConfig, config)
