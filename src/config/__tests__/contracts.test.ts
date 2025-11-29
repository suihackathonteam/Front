import { describe, it, expect } from "vitest";
import { CONTRACT_CONFIG, ACTION_TYPES, EVENT_TYPES, getModuleId, isContractConfigured } from "../contracts";

describe("Contract Configuration", () => {
    it("should have valid contract config", () => {
        expect(CONTRACT_CONFIG.PACKAGE_ID).toBeDefined();
        expect(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID).toBeDefined();
        expect(CONTRACT_CONFIG.MODULE_NAME).toBe("identity");
    });

    it("should have correct action types", () => {
        expect(ACTION_TYPES.CLOCK_IN).toBe(0);
        expect(ACTION_TYPES.CLOCK_OUT).toBe(1);
        expect(ACTION_TYPES.DOOR_ENTRY).toBe(2);
        expect(ACTION_TYPES.DOOR_EXIT).toBe(3);
    });

    it("should have correct event types", () => {
        expect(EVENT_TYPES.DOOR_ACCESS).toBe("DoorAccessEvent");
        expect(EVENT_TYPES.MACHINE_USAGE).toBe("MachineUsageEvent");
        expect(EVENT_TYPES.CLOCK).toBe("ClockEvent");
        expect(EVENT_TYPES.AWARD).toBe("AwardEvent");
        expect(EVENT_TYPES.STATS_UPDATE).toBe("StatsUpdateEvent");
    });

    it("should generate correct module ID", () => {
        const moduleId = getModuleId();
        expect(moduleId).toContain("::identity");
        expect(moduleId).toContain(CONTRACT_CONFIG.PACKAGE_ID);
    });

    it("should correctly detect contract configuration", () => {
        const isConfigured = isContractConfigured();
        expect(typeof isConfigured).toBe("boolean");
    });
});
