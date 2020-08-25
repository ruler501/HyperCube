const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules[\/\\](?!react-dnd|dnd-core)/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, 'babel.config.js'),
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'source-map',
  resolve: {
    modules: ['src', 'node_modules'],
  },
};

const clientConfig = merge(config, {
  entry: {
    BlogPostPage: './src/pages/BlogPostPage.js',
    BulkUploadPage: './src/pages/BulkUploadPage.js',
    CubeSamplePackPage: './src/pages/CubeSamplePackPage.js',
    CubeAnalysisPage: './src/pages/CubeAnalysisPage.js',
    CubeBlogPage: './src/pages/CubeBlogPage.js',
    CubeComparePage: './src/pages/CubeComparePage.js',
    CubeDeckPage: './src/pages/CubeDeckPage.js',
    CubeDecksPage: './src/pages/CubeDecksPage.js',
    CubeDeckbuilderPage: './src/pages/CubeDeckbuilderPage.js',
    CubeDraftPage: './src/pages/CubeDraftPage.js',
    CubeListPage: './src/pages/CubeListPage.js',
    CubeOverviewPage: './src/pages/CubeOverviewPage.js',
    CubePlaytestPage: './src/pages/CubePlaytestPage.js',
    DashboardPage: './src/pages/DashboardPage.js',
    GridDraftPage: './src/pages/GridDraftPage.js',
    DevBlog: './src/pages/DevBlog.js',
    ContactPage: './src/pages/ContactPage.js',
    DonatePage: './src/pages/DonatePage.js',
    InfoPage: './src/pages/InfoPage.js',
    FiltersPage: './src/pages/FiltersPage.js',
    DownTimePage: './src/pages/DownTimePage.js',
    ErrorPage: './src/pages/ErrorPage.js',
    CardSearchPage: './src/pages/CardSearchPage.js',
    TopCardsPage: './src/pages/TopCardsPage.js',
    CardPage: './src/pages/CardPage.js',
    CommentPage: './src/pages/CommentPage.js',
    LoginPage: './src/pages/LoginPage.js',
    RegisterPage: './src/pages/RegisterPage.js',
    LostPasswordPage: './src/pages/LostPasswordPage.js',
    NotificationsPage: './src/pages/NotificationsPage.js',
    PasswordResetPage: './src/pages/PasswordResetPage.js',
    UserAccountPage: './src/pages/UserAccountPage.js',
    UserBlogPage: './src/pages/UserBlogPage.js',
    UserDecksPage: './src/pages/UserDecksPage.js',
    UserSocialPage: './src/pages/UserSocialPage.js',
    UserCubePage: './src/pages/UserCubePage.js',
  },
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].js.map',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
});

const serverConfig = merge(config, {
  target: 'node',
  entry: {
    'pages/DashboardPage': './src/pages/DashboardPage.js',
    'pages/DevBlog': './src/pages/DevBlog.js',
    'pages/Loading': './src/pages/Loading.js',
    'pages/BlogPostPage': './src/pages/BlogPostPage.js',
    'pages/BulkUploadPage': './src/pages/BulkUploadPage.js',
    'pages/CubeAnalysisPage': './src/pages/CubeAnalysisPage.js',
    'pages/CubeBlogPage': './src/pages/CubeBlogPage.js',
    'pages/CubeComparePage': './src/pages/CubeComparePage.js',
    'pages/CubeDeckPage': './src/pages/CubeDeckPage.js',
    'pages/CubeDeckbuilderPage': './src/pages/CubeDeckbuilderPage.js',
    'pages/CubeDecksPage': './src/pages/CubeDecksPage.js',
    'pages/CubeDraftPage': './src/pages/CubeDraftPage.js',
    'pages/CubeListPage': './src/pages/CubeListPage.js',
    'pages/CubeOverviewPage': './src/pages/CubeOverviewPage.js',
    'pages/CubePlaytestPage': './src/pages/CubePlaytestPage.js',
    'pages/CubeSamplePackPage': './src/pages/CubeSamplePackPage.js',
    'pages/GridDraftPage': './src/pages/GridDraftPage.js',
    'pages/ContactPage': './src/pages/ContactPage.js',
    'pages/InfoPage': './src/pages/InfoPage.js',
    'pages/DonatePage': './src/pages/DonatePage.js',
    'pages/DownTimePage': './src/pages/DownTimePage.js',
    'pages/FiltersPage': './src/pages/FiltersPage.js',
    'pages/ErrorPage': './src/pages/ErrorPage.js',
    'pages/CardSearchPage': './src/pages/CardSearchPage.js',
    'pages/TopCardsPage': './src/pages/TopCardsPage.js',
    'pages/CardPage': './src/pages/CardPage.js',
    'pages/CommentPage': './src/pages/CommentPage.js',
    'pages/LoginPage': './src/pages/LoginPage.js',
    'pages/RegisterPage': './src/pages/RegisterPage.js',
    'pages/LostPasswordPage': './src/pages/LostPasswordPage.js',
    'pages/NotificationsPage': './src/pages/NotificationsPage.js',
    'pages/PasswordResetPage': './src/pages/PasswordResetPage.js',
    'pages/UserAccountPage': './src/pages/UserAccountPage.js',
    'pages/UserBlogPage': './src/pages/UserBlogPage.js',
    'pages/UserDecksPage': './src/pages/UserDecksPage.js',
    'pages/UserSocialPage': './src/pages/UserSocialPage.js',
    'pages/UserCubePage': './src/pages/UserCubePage.js',
    'utils/Card': './src/utils/Card.js',
    'utils/draftutil': './src/utils/draftutil.js',
    'utils/Draft': './src/utils/Draft.js',
    'filtering/FilterCards': './src/filtering/FilterCards.js',
    'utils/Sort': './src/utils/Sort.js',
    'utils/Util': './src/utils/Util.js',
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  externals: [
    nodeExternals({
      whitelist: ['react-tag-input', 'react-dnd', 'dnd-core', 'react-dnd-html5-backend', 'react-dnd-touch-backend'],
    }),
  ],
});

module.exports = { clientConfig, serverConfig };
