/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package support.data;

/**
 *
 * @author werpu2
 */
public enum AddressType {

    PRIVATE(0, "PRIVATE"),
    COMPANY(1, "COMPANY"),
    PRIVATE_SECONDARY(2, "PRIVATE_SECONDARY"),
    COMPANY_SECONDARY(3, "COMPANY_SECONDARY");
    
    int value = 0;
    String key;

    AddressType(int adrType, String key) {
        value = adrType;
    }

    public int getValue() {
        return value;
    }

    public String getKey() {
        return key;
    }

    static public AddressType getObject(int value) {
        switch (value) {
            case 0:
                return PRIVATE;
            case 1:
                return COMPANY;
            case 2:
                return PRIVATE_SECONDARY;
            case 3:
                return COMPANY_SECONDARY;
        }
        throw new IndexOutOfBoundsException("value does not represent a proper address type");
    }
}
