import {GameballApp, GameballConfig} from 'react-native-gameball';

/**
 * Gameball SDK Service
 * Singleton pattern to ensure SDK is initialized only once
 */
class GameballService {
  private static instance: GameballService;
  private isInitialized: boolean = false;
  private isCustomerInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;
  private customerInitPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): GameballService {
    if (!GameballService.instance) {
      GameballService.instance = new GameballService();
    }
    return GameballService.instance;
  }

  /**
   * Initialize Gameball SDK once
   * Uses a promise gate to ensure only one initialization happens
   */
  async initGameball(): Promise<void> {
    if (this.isInitialized) {
      console.log('[GameballService] SDK already initialized');
      return;
    }

    if (this.initPromise) {
      console.log('[GameballService] SDK initialization already in progress, waiting...');
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        console.log('[GameballService] Starting SDK initialization...');
        const gameballApp = GameballApp.getInstance();

        const config: GameballConfig = {
          apiKey: '***',
          lang: 'en',
        };

        await gameballApp.init(config);
        this.isInitialized = true;
        console.log('[GameballService] SDK initialized successfully');
      } catch (error) {
        console.error('[GameballService] SDK initialization failed:', error);
        this.initPromise = null; // Reset on error to allow retry
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * Initialize customer with hardcoded customerId = "1"
   * Must be called after initGameball()
   */
  async initCustomer(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Gameball SDK must be initialized before initializing customer');
    }

    if (this.isCustomerInitialized) {
      console.log('[GameballService] Customer already initialized');
      return;
    }

    if (this.customerInitPromise) {
      console.log('[GameballService] Customer initialization already in progress, waiting...');
      return this.customerInitPromise;
    }

    this.customerInitPromise = (async () => {
      try {
        console.log('[GameballService] Starting customer initialization with customerId: 1');
        const gameballApp = GameballApp.getInstance();

        await gameballApp.initializeCustomer({
          customerId: '1',
        });

        this.isCustomerInitialized = true;
        console.log('[GameballService] Customer initialized successfully');
      } catch (error) {
        console.error('[GameballService] Customer initialization failed:', error);
        this.customerInitPromise = null; // Reset on error to allow retry
        throw error;
      }
    })();

    return this.customerInitPromise;
  }

  /**
   * Open Gameball profile in guest mode
   */
  async openGuestProfile(): Promise<void> {
    try {
      console.log('[GameballService] Opening guest profile...');
      const gameballApp = GameballApp.getInstance();

      await gameballApp.showProfile({
        showCloseButton: true,
      });

      console.log('[GameballService] Guest profile opened successfully');
    } catch (error) {
      console.error('[GameballService] Failed to open guest profile:', error);
      throw error;
    }
  }

  /**
   * Open Gameball profile in customer mode with customerId = "1"
   */
  async openCustomerProfile(): Promise<void> {
    try {
      console.log('[GameballService] Opening customer profile with customerId: 1');
      const gameballApp = GameballApp.getInstance();

      await gameballApp.showProfile({
        customerId: '1',
        showCloseButton: true,
      });

      console.log('[GameballService] Customer profile opened successfully');
    } catch (error) {
      console.error('[GameballService] Failed to open customer profile:', error);
      throw error;
    }
  }
}

export default GameballService.getInstance();
