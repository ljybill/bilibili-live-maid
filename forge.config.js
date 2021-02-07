module.exports = {
  packagerConfig: {
    icon: 'public/bilibili-live-maid.icns',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'B站直播助手',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin',
      ],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
