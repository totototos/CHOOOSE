import { test, expect, BrowserContext, Page } from '@playwright/test';


test('Check if Sales tax is displayed for flights from Canada airport', async ({ page }) => {
await openURLandCloseCookies(page)
await selectAirportFrom(page, 'canada')
await selectRandomAirporTo(page)
await calculateAndGoToNextPage(page)

await expect(page.locator(`//p[contains(text(), 'Sales tax')]`)).toBeVisible()
await expect(page.locator(`//p[contains(text(), 'Sales tax')]/following-sibling::p`)).toBeVisible()

await goToPayment(page)

await expect(page.locator(`//p[contains(text(), 'Sales tax')]`)).toBeVisible()
await expect(page.locator(`//p[contains(text(), 'Sales tax')]/following-sibling::p`)).toBeVisible()

await page.close()
});

test('Check if user is unable to proceed without filling added flight stop', async ({page}) => {
  await openURLandCloseCookies(page)
  await selectRandomAirporFrom(page)
  await selectRandomAirporTo(page)
  await addNewStop(page)
 await page.getByRole('button', { name: 'Calculate' }).click()
  await expect(page.getByText('All added stops must be filled in')).toBeVisible()
  await page.close()
});




async  function openURLandCloseCookies(page) {
  await page.goto('https://choooselpbatest.azureedge.net/?cartView=true')
   const addressCarbonFootprint = page.getByText('Address your carbon footprint')
  const acceptCookies = page.getByText('AcceptCookies')
  const closeCookies = page.getByRole('button', { name: 'Close' })
  await expect(addressCarbonFootprint).toBeVisible({timeout: 10000})
  await closeCookies.click({timeout: 4000})
}

async function selectAirportFrom(page, searchByText?: string) {
  await page.locator('.css-ipwess').first().click()
  await page.getByLabel('From').fill(searchByText)
  await page.locator('.css-ipwess').first().click()
  const randomNumber = getRandomNumber()
  await page.locator(`#react-select-2-option-0-${randomNumber}[role=button]`).click()
}

async function selectRandomAirporFrom(page) {
  await page.locator('.css-ipwess').first().click()
  const randomChar = getRandomChar()
  await page.getByLabel('From').fill(randomChar)
  await page.locator('.css-ipwess').first().click()
  await page.waitForTimeout(500)
  const randomNumber = getRandomNumber()
  await page.locator(`#react-select-2-option-0-${randomNumber}[role=button]`).click()
}

async function selectAirportTo(page, searchByText?: string) {
  await page.locator('.css-ipwess').last().click()
  await page.getByLabel('To').fill(searchByText)
  await page.locator('.css-ipwess').last().click()
  const randomNumber = getRandomNumber()
  await page.locator(`#react-select-3-option-0-${randomNumber}[role=button]`).click()
}

async function selectRandomAirporTo(page) {
  await page.locator('.css-ipwess').last().click()
  const randomChar = getRandomChar()
  await page.getByLabel('To').fill(randomChar)
  await page.locator('.css-ipwess').last().click()
  await page.waitForTimeout(500)
  const randomNumber = getRandomNumber()
  await page.locator(`#react-select-3-option-0-${randomNumber}[role=button]`).click()
}

function getRandomChar() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  return alphabet[Math.floor(Math.random() * alphabet.length)]
}

function getRandomNumber() {
  const numbers = '123456789'
  return numbers[Math.floor(Math.random() * numbers.length)]
}

async function calculateAndGoToNextPage(page) {
  await page.getByRole('button', { name: 'Calculate' }).click()
 await expect(page.getByRole('button', { name: 'Go to payment' })).toBeVisible()
}

async function goToPayment(page) {
  await page.getByRole('button', { name: 'Go to payment' }).click()
  await expect(page.getByRole('button', { name: 'Pay by card' })).toBeVisible()
}

async function addNewStop(page) {
  await page.getByRole('button', { name: 'Add stop' }).click()
  await expect(page.getByLabel('Stop')).toBeVisible()
}
