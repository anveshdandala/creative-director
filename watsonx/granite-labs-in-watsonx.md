# Run IBM Granite Labs in IBM watsonx

You can run any of the recipes in the [Granite Snack Cookbook](https://github.com/ibm-granite-community/granite-snack-cookbook/blob/main/README.md) in IBM watsonx.

# Contents

Complete the following tasks to run a recipe in IBM watsonx.

- [Task 1: Sign up for an IBM watsonx trial account](#task01)
- [Task 2: Obtain your credentials for programmatic access](#task02)
- [Task 3: Associate the watsonx.ai Runtime service with your project](#task03)
- [Task 4: Create a notebook in the project](#task04)

# Task 1: Sign up for an IBM watsonx trial account
<a name="task01">

When you sign up for a watsonx trial, the watsonx.ai Studio and watsonx.ai Runtime services are provisoned for you. Follow these steps to sign up for a trial account:

1. Visit the watsonx product page at [https://www.ibm.com/products/watsonx](https://www.ibm.com/products/watsonx).

1. Click **Try watsonx for free**.

1. Watch this video to see how to sign up for an account:

   <a href="https://video.ibm.com/embed/channel/23952663/video/wx-signup">![Sign up video](images/video-thumbnail-signup.png "Sign up video")</a>

1. Select your region, for example, **Dallas**.

1. Click **Create account or log in**.

1. If you already have an IBMid, then click Log in, and sign in with your existing email address and password.

1. If you don’t have an iBMid, type your email address, and complete the registration process to create an account.

# Task 2: Obtain your credentials for programmatic access
<a name="task02">

To call the watsonx service, you need credentials. Follow these steps to create a API key, and obtain your watsonx.ai URL and project ID:

1. Click **IBM watsonx** to return to the home screen, and scroll to the *Developer access* section.

1. In the *Project or space* drop-down list, select your sandbox project.

1. Next to the *Project ID*, click the **Copy** icon ![Copy icon](images/copy.svg "Copy icon"). Save this ID to a text file to be used later.

1. Next to *watsonx.ai URL*, lick the **Copy** icon ![Copy icon](images/copy.svg "Copy icon"). Save this URL to a text file to be used later.

1. Click **Create API key**.

   1. Provide a name, such as, `watsonx API key`.

   1. Click **Create**.

1. Click **Copy**, and save it to a text file to be used later.

1. Click **Download** to save the API key in a JSON file for future use.

1. Close the API key window.

# Task 3: Associate the watsonx.ai Runtime service with your project
<a name="task03">

When you sign up for a watsonx account, a sandbox project is created for you. Follow these steps to associate your wasonx.ai Runtime service with your project:

1. From the watsonx home screen, scroll to the *Projects* section.

1. Select your sandbox project.

1. Click the **Manage** tab.

1. Select the **Services & integrations** page.

1. Click **Associate service**.

1. Select your watsonx.ai Runtime service.

1. Click **Associate*.

# Task 4: Create a notebook in the project
<a name="task04">

You can create a notebook based on a URL to import this notebook into a project. Follow these steps to create the notebook:

1. In your sandbox project, click the **Assets** tab.

1. Click **New asset > Work with data and models in Python or R notebooks**.

1. Select the **URL** page.

1. Type a name for the notebook. For example, `Contract Analysis using IBM Granite`.

1. In the *Notebook URL* field, paste the URL for this notebook. For example: `https://raw.githubusercontent.com/ibm-granite-community/granite-snack-cookbook/refs/heads/main/recipes/Contract-Analysis/Granite_Recipes_Contracts_Analysis.ipynb`

1. Click **Create**, and wait for the notebook to load.