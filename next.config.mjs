/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsHmrCache: false,
    },

    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pyejzayswodifnpzniku.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            }
        ],
    },


};

export default nextConfig;
